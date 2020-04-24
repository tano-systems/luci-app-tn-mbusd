/*
 * Copyright (c) 2019-2020 Tano Systems LLC. All Rights Reserved.
 * Author: Anton Kikin <a.kikin@tano-systems.com>
 */

'use strict';
'require rpc';
'require form';

var callFileList = rpc.declare({
	object: 'file',
	method: 'list',
	params: [ 'path' ],
	expect: { entries: [] },
	filter: function(list, params) {
		var rv = [];
		for (var i = 0; i < list.length; i++)
			if (list[i].name.match(/^tty[A-Z]/) || list[i].name.match(/^[0-9]+$/))
				rv.push(params.path + list[i].name);
		return rv.sort();
	}
});

return L.view.extend({
	load: function() {
		var serialDevices = [];
		return callFileList('/dev/').then(L.bind(function(devices) {
			for (var i = 0; i < devices.length; i++)
				serialDevices.push(devices[i])
			return callFileList('/dev/tts/');
		}, this)).then(L.bind(function(devices) {
			for (var i = 0; i < devices.length; i++)
				serialDevices.push(devices[i])
			return serialDevices;
		}, this));
	},

	render: function(serialDevices) {
		var m, s, o;

		m = new form.Map('mbusd', _('Modbus TCP to Modbus RTU Gateway'));

		s = m.section(form.GridSection, 'mbusd', _('Ports Configuration'));
		s.addremove = true;
		s.anonymous = true;
		s.sortable  = true;

		s.tab('general', _('General Settings'));
		s.tab('rtu', _('RTU Settings'));
		s.tab('tcp', _('TCP Settings'));

		//
		// General
		//
		o = s.taboption('general', form.Flag, 'enable', _('Enable'));
		o.rmempty = false;
		o.default = true;
		o.editable = true;

		o = s.taboption('general', form.ListValue, 'log_verbosity', _('Log verbosity'));
		o.rmempty = false;
		o.modalonly = true;
		o.default = 1;
		o.value('0', _('Only errors'));
		o.value('1', _('Warnings'));
		o.value('2', _('Information'));

		//
		// RTU
		//
		o = s.taboption('rtu', form.Value, 'device', _('Serial device'));
		o.rmempty = false;
		o.editable = true;
		o.width = '150px';
		o.datatype = 'string';

		for (var i = 0; i < serialDevices.length; i++)
			o.value(serialDevices[i]);

		o.validate = function(section_id, value) {
			var sections = this.section.cfgsections();
			for (var i = 0; i < sections.length; i++) {
				if (sections[i] == section_id)
					continue;

				if (this.formvalue(sections[i]) == value)
					return _('Multiple instances with same device is not allowed');
			}

			return true;
		};

		o = s.taboption('rtu', form.ListValue, 'speed', _('Baudrate'));
		o.rmempty = false;
		o.default = '115200';
		o.width = '100px';
		o.editable = true;
		o.value('110');
		o.value('150');
		o.value('300');
		o.value('1200');
		o.value('2400');
		o.value('4800');
		o.value('9600');
		o.value('19200');
		o.value('38400');
		o.value('57600');
		o.value('115200');
		o.value('230400');
		o.value('460800');
		o.value('921600');

		o = s.taboption('rtu', form.ListValue, 'parity', _('Parity'));
		o.rmempty = false;
		o.default = 'none';
		o.editable = true;
		o.width = '100px';
		o.value('none', _('None', 'Parity'));
		o.value('even', _('Even', 'Parity'));
		o.value('odd', _('Odd', 'Parity'));

		o = s.taboption('rtu', form.ListValue, 'stopbits', _('Stop bits'));
		o.rmempty = false;
		o.default = '1';
		o.editable = true;
		o.value('1');
		o.value('2');

		o = s.taboption('rtu', form.Value, 'retries', _('Request retries'),
			_('Specifies maximum number of request retries (0–15, 0 — no retries)'));
		o.rmempty = false;
		o.datatype = 'range(0,15)';
		o.modalonly = true;
		o.default = 3;

		o = s.taboption('rtu', form.Value, 'pause', _('Pause between requests'),
			_('Specifies pause between requests in milliseconds (1–10000)'));
		o.rmempty = false;
		o.datatype = 'range(1,10000)';
		o.modalonly = true;
		o.default = 100;

		o = s.taboption('rtu', form.Value, 'wait', _('Response wait time'),
			_('Specifies response wait time in milliseconds (1–10000)'));
		o.rmempty = false;
		o.datatype = 'range(1,10000)';
		o.modalonly = true;
		o.default = 500;

		//
		// TCP
		//
		o = s.taboption('tcp', form.Value, 'bind', _('TCP address'));
		o.rmempty = false;
		o.modalonly = true;
		o.default = '0.0.0.0';
		o.editable = true;

		o = s.taboption('tcp', form.Value, 'port', _('TCP port'));
		o.rmempty = false;
		o.default = 502;
		o.width = '100px';
		o.editable = true;
		o.validate = function(section_id, value) {
			var sections = this.section.cfgsections();
			for (var i = 0; i < sections.length; i++) {
				if (sections[i] == section_id)
					continue;

				if (this.formvalue(sections[i]) == value)
					return _('Multiple instances with same TCP port is not allowed');
			}

			return true;
		};

		o = s.taboption('tcp', form.Value, 'maxconn', _('Maximum TCP connections'),
			_('Specifies maximum number of simultaneous TCP connections (1–128)'));
		o.rmempty = false;
		o.modalonly = true;
		o.datatype = 'range(1,128)';
		o.default = 8;

		o = s.taboption('tcp', form.Value, 'timeout', _('Timeout'),
			_('Specifies connection timeout in seconds (0–1000, 0 — no timeout)'));
		o.datatype = 'range(0,1000)';
		o.rmempty = false;
		o.modalonly = true;
		o.default = 60;

		return m.render();
	},
});
