# docker-hub
Docker image for Dagcoin hub

## Usage

The simplest way to create the docker image and run Dagcoin hub is below.

```console
$ docker build -t hub .
$ docker run -d hub
```

although it is always a good idea to give a container a name you can remember:

```console
$ docker run -d --name my-hub hub
```

To stop the container and then restart it again, use:

```console
$ docker stop my-hub
$ docker start my-hub
```

### Using volumes

Although the hub docker image has been set up to create a volume
and store the dagcoin runtime files on the host filesystem, using a named volume
is recommended so containers can be dropped and recreated easily by referencing
the existing storage by a simple name:

```console
$ docker volume create --name dagcoin-hub
$ docker run -d --name my-hub -v hub:/dagcoin dagcoin-hub
```

NOTE: The configuration files are stored in the `/dagcoin` folder inside the container. 

### Changing the configuration

In order to change the configuration file, stop the hub container
and start a new one like below:

```console
$ docker run -it --rm -v hub:/dagcoin hub vi /dagcoin/conf.json
```

This will mount the named dagcoin volume and open/create the conf.json file in the
`vi` text editor. When you quit from `vi` the container will automatically
delete itself due to the `--rm` flag.

Now you can start the container again and the app will start up with the 
changed configuration.

See configuration options here:
* [byteball/byteballcore](https://github.com/byteball/byteballcore)
* [hub](./README.md)

### Checking the log file

In case you need to check the log files you can use the following command:

```console
$ docker run -it --rm -v hub:/dagcoin hub less /dagcoin/log.txt
```

### Exposing port to the host system

If you enabled the default websocket port (6611) you may want to map it a port
on your host system. You have to create the container as below, but you may
first want to stop and remove the running container before creating a new one.

```console
$ docker stop my-hub
$ docker rm my-hub
$ docker run -d --name my-hub -v hub:/dagcoin -p 6611:6611 hub
```

This will map the 6611 port of the host system to the 6611 port of the container.
