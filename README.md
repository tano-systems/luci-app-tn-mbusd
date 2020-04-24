# Modbus TCP to Modbus RTU gateway configuration LuCI application

## Description
This is an LuCI web UI application for Modbus TCP to Modbus RTU gateway configuration.

## Dependencies and Limitations
This LuCI application developed for LuCI master branch with client side JavaScript UI.

This application needs custom initialization scripts for mbusd daemon that can be found in the [meta-tanowrt] OpenEmbedded layer.

## Supported Languages
- English
- Russian

## Screenshots

### Main Application Page
![Configured Ports Table](screenshots/mbusd.png?raw=true)

### Port Settings
![Port General Settings](screenshots/mbusd-general.png?raw=true)

![Port Modbus RTU Settings](screenshots/mbusd-rtu.png?raw=true)

![Port Modbus TCP Settings](screenshots/mbusd-tcp.png?raw=true)

[meta-tanowrt]: https://github.com/tano-systems/meta-tanowrt.git
