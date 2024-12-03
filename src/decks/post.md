---
title: "Security Champions Biel"
---
<!-- .slide: data-auto-animate -->

<img src="/img/kitten_cropped.png" class="r-stretch"/>

# (an) attacker perspective
## with
## [maia arson crimew](https://maia.crimew.gay)

---
<!-- .slide: data-auto-animate -->

<img src="/img/kitten_cropped.png" class="r-stretch"/>

## maia arson crimew

* is 25 years old <!-- .element: class="fragment" -->
* uses it/she pronouns <!-- .element: class="fragment" -->
* has been a hacktivist since 2019 <!-- .element: class="fragment" -->
* got indicted in 2021 ^-^ oopsie <!-- .element: class="fragment" -->
* leaked the 2019 version of the US no fly list in 2023 <!-- .element: class="fragment" -->
* is an investigative journalist and researcher <!-- .element: class="fragment" -->
* has been reporting on commercial spyware since 2023<!-- .element: class="fragment" -->

---
<!-- .slide: data-auto-animate data-auto-animate-restart -->

## what will i cover today

* what is stalkerware
* how to hack stalkerware
* what about post.ch

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-0/cover.jpg" data-background-opacity="0.2" data-auto-animate data-auto-animate-restart -->

## what is stalkerware

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-0/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## what is stalkerware

* commercially available spyware
* often advertised for:<!-- .element: class="fragment" -->
    * "parental control" <!-- .element: class="fragment" -->
    * figuring out if your partner is cheating on you<!-- .element: class="fragment" -->
* hidden from the target, often pretends to be system application<!-- .element: class="fragment" -->
* usually requires brief physical access, can be remotely installed<!-- .element: class="fragment" -->

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-0/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## what is stalkerware

* reports activity on the victim device, such as:
    * text messages sent and received<!-- .element: class="fragment" -->
    * phone calls made (sometimes with recording)<!-- .element: class="fragment" -->
    * websites visited<!-- .element: class="fragment" -->
    * any photos taken<!-- .element: class="fragment" -->
    * geolocation<!-- .element: class="fragment" -->
    * ambient audio recordings<!-- .element: class="fragment" -->
* sometimes allows remote sending of text messages<!-- .element: class="fragment" -->

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-1/cover.jpg" data-background-opacity="0.2" -->

## why is this bad?

Note:
spying on partners is bad, spying on kids is bad, trying to solve social issues with technology, stolen text messages allow theft of 2fa codes and taking over other accounts, privacy is a fucking human right for everyone no matter who they are, what they do or how old they are
---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-1/cover.jpg" data-background-opacity="0.2" -->

## why we hack stalkerware providers

* legislation and courts are slow<!-- .element: class="fragment" -->
* we can collectively defend ourselves from abusive technology<!-- .element: class="fragment" -->
* most stalkerware providers have horrible security<!-- .element: class="fragment" -->

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide

<video data-autoplay src="/img/posts/fuckstalkerware-2/tizer.mp4"></video>

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide

* an iranian stalkerware<!-- .element: class="fragment" -->
* users/victims all over the world<!-- .element: class="fragment" -->
* 750k users<!-- .element: class="fragment" -->
* extremely trivial to hack<!-- .element: class="fragment" -->

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide

* exposed .git directory allows stealing dashboard source code using [goop](https://github.com/nyancrimew/goop)
<img src="/img/posts/fuckstalkerware-2/goop.jpg"/>
* turns out to be a trashy php monorepo for both frontend + backend<!-- .element: class="fragment" -->

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### trying to find something to exploit

* auth cookies are in the format of<!-- .element: class="fragment" --> `userid.passwordmd5.lang.timezone.db_type`
  * user ids are sequential<!-- .element: class="fragment" -->
  * yes, the password as represented in the db with salt and all is in the cookie<!-- .element: class="fragment" -->
  * db type is either a or b, where b appears to stand for "backup", both my accounts are on type b<!-- .element: class="fragment" -->

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### trying to find something to exploit

for auth via level2 phone app an "app key" is required, which is described by code comments as follows:
```php
// $app_key is generated in level2 app hash(md5_pass.username.private_key)
// $u_id will send from level2 app to identify target user
// $tz is level2 app phone timezone
// $lang is level2 app phone default language
```
the mentioned private key (which is actually a static salt) is<!-- .element: class="fragment" --> `asrome_intermilan_realmadrid`.

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### trying to find something to exploit

* `uploadPhoto`, `uploadRecordAmbient` and `uploadRecordCall` allow arbitrary file uploads
```php [9]
$allowed = array('3gp');
$objFile = & $file_array["recordcall"];
$filename = $objFile['name'];
$record_id = explode(".",$filename);
$record_id = explode("_",$record_id[0]);
$record_id = $record_id[2];
$ext = pathinfo($filename, PATHINFO_EXTENSION);
if(!in_array($ext,$allowed) ) {
// error_log("HACKER:".basename( $objFile["name"] ));
}
```
<!-- .element: class="fragment" -->
* <!-- .element: class="fragment" --> <code>uploadRecordAmbient</code> and <code>uploadRecordCall</code> actually note that this is a vulnerability and a check for only allowing .mp3 or .3gp files respectively exists but result is ignored
* this should work to give us code execution<!-- .element: class="fragment" -->

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### trying to find something to exploit

* one problem left: we need a device id
* reversing a bit more of the code to figure out how to register a device to my test account<!-- .element: class="fragment" -->
* we now have a device with the very numeric id 'maia'<!-- .element: class="fragment" -->
* time to upload a "photo" (base64 encoded webshell)<!-- .element: class="fragment" -->
    * as a little extra flex i use directory traveral to place it at /funky.php<!-- .element: class="fragment" -->

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate data-autoslide="64554" -->

## example: SpyHide
### it's exploitin' time

<img src="/img/posts/fuckstalkerware-2/funkytimes.jpg"/>

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### it's exploitin' time

* compress and download all webroots hosted on this server using the webshell
* grab all databases using an existing adminer install<!-- .element: class="fragment" -->

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### it's exploitin' time

<img src="/img/decks/fuckstalkerware/adminer.jpg"/>

---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### analysis

* over 230gb of exfiltrated data<!-- .element: class="fragment" -->
  * source code, databases<!-- .element: class="fragment" -->
  * photos, calls and ambient audio recordings from phones<!-- .element: class="fragment" -->
* some account owners have spied on as much as 30 different devices over the course of multiple years, stalking some people accross multiple phone changes<!-- .element: class="fragment" -->
* dataset actually makes it somewhat possible to identify victims, containing some imeis and phone numbers<!-- .element: class="fragment" -->

Note:
for a more detailed analysis of this data check my blog of the NZZ article based on my data

---
<!-- .slide: data-auto-animate data-auto-animate-restart -->

## post.ch

### how one might stage a targeted attack against you

*disclaimer: no actual intrusion took place, but i conducted some high level recon*

Note:
i will largely focus on my personal process, but many other people i know take a similar kind of "low hanging fruit first" approach

---
<!-- .slide: data-auto-animate -->

## post.ch

<img src="/img/decks/post/subdomain-finder.jpg"/>

Note:
subdomain finder lets me easily find over 2000 post subdomains

---
<!-- .slide: data-auto-animate -->

## post.ch

<img src="/img/decks/post/zoomeye.jpg"/>

Note:
similarly a tool like zoomeye or shodan can be used to find all public servers on your network

---
<!-- .slide: data-auto-animate -->

## post.ch

<img src="/img/decks/post/scan.png"/>


Note:
with a simple bash script i can then check if any servers have .git exposed or perform any number of other scans, im curious if any of your systems actually detected this on the 27th :p

i did not find any exposed .git directory, good job

---
<!-- .slide: data-auto-animate -->

## post.ch

<img src="/img/decks/post/infostealer.jpg"/>

Note:
a quick search lets me find employee passwords captured by infostealer malware, as well as accounts used to authenticate to any post service

---
<!-- .slide: data-auto-animate -->

## post.ch

* a number of post employees are signed up to spyware services using their @post.ch work email
* this compromising information could be used for social engineering

Note:
potential consequences from work, outing them to their stalking victim, etc

---

<img src="/img/kitten_cropped.png" class="r-stretch"/>

# Q & A