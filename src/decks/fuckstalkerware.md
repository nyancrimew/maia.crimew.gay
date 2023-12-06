---
title: "#FuckStalkerware at ETH"
---
<!-- .slide: data-auto-animate -->

<img src="/img/kitten_cropped.png" class="r-stretch"/>

# hacking a morally bankrupt industry
## a talk about stalkerware, hacktivism and ethics
## [maia arson crimew](https://maia.crimew.gay)

**content warning:** discussion of abuse/controlling behavior

---
<!-- .slide: data-auto-animate -->

<img src="/img/kitten_cropped.png" class="r-stretch"/>

## maia arson crimew

* is 24 years old <!-- .element: class="fragment" -->
* uses it(/she) pronouns <!-- .element: class="fragment" -->
* has been a hacktivist since 2019 <!-- .element: class="fragment" -->
* got indicted in 2021 ^-^ oopie <!-- .element: class="fragment" -->
* leaked the 2019 version of the US no fly list in 2023 <!-- .element: class="fragment" -->
* is a silly "journalist/blogger" <!-- .element: class="fragment" -->
* is literally a kitten <!-- .element: class="fragment" -->

---
<!-- .slide: data-auto-animate data-auto-animate-restart -->

## what did it do for the rest of this year

---
<!-- .slide: data-auto-animate -->

## what did it do for the rest of this year

* published thousands of emails revealing the secret US based working group behind much of current international anti-trans legislation
* reported on various hacks by other actors <!-- .element: class="fragment" -->
    * a cybersecurity company pwned by a random 4chan user <!-- .element: class="fragment" -->
    * kittensec leaking romanian and EU government data <!-- .element: class="fragment" -->
    * a write up on various security issues in the streaming platform kick.com <!-- .element: class="fragment" -->
    * an exclusive report on how rosgosstrakh got hacked <!-- .element: class="fragment" -->
---
<!-- .slide: data-auto-animate -->
## what did it do for the rest of this year

* investigative internet pop culture journalism
    * an ifunny clone that isn't actually what it seems at all <!-- .element: class="fragment" -->
    * how a popular tiktok meme account has a dark past and connections to the far right <!-- .element: class="fragment" -->
* guested on various political and pop culture podcasts <!-- .element: class="fragment" -->
* various other media work <!-- .element: class="fragment" -->
* <!-- .element: class="fragment" --> started the <b>#FuckStalkerware</b> project to help combat stalkerware and get an insight into the industry 

Note:
pocasts such as well there's your problem, the worst of all possible worlds, red planet and many more

media work both giving interviews and portraits about myself and acting as an expert on various topics
---
## let's cover some basics

* what's hacktivism<!-- .element: class="fragment" -->
* what is my motivation<!-- .element: class="fragment" -->

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
  * yes, the password as represented in the db with the db salt and all is in the cookie<!-- .element: class="fragment" -->
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
* grabbing all databases using an existing adminer install<!-- .element: class="fragment" -->

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
no journalists, victim support groups or researchers appear to have made use of that fact so far as far as im aware
---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### analysis

* a look through email addresses used for registration reveals around 190 users with various government email addresses
  * at least 16 us government addresses, incl .mil and various correctional officers<!-- .element: class="fragment" -->
  * 5 users from colombian national police<!-- .element: class="fragment" -->
  * massive amounts of users from brazilian and philippine departments of education<!-- .element: class="fragment" -->
* spyhide data retention claims are a lie<!-- .element: class="fragment" -->
    * photos and recordings from as far back as 2020 found despite claims they are deleted after 3 months<!-- .element: class="fragment" -->

Note:
there is no email verification, so data may be skewed

police and correctional officer use implies possible evaluation of commercial spyware for law enforcement use, a pattern observed in other datasets as well

based on code analysis data is only deleted when operator stops paying.
---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### analysis

<img src="/img/decks/fuckstalkerware/spyhide-gps-world.jpg" class="r-stretch"/>

*image credit:* [TechCrunch](https://techcrunch.com/2023/07/24/spyhide-stalkerware-android/)

Note:
a map of all recorded gps location data points in the dataset, showing spyhide being used all over the world with hotspots in europa, brazil, indonesia and the US
---
<!-- .slide: data-background-image="/img/posts/fuckstalkerware-2/cover.jpg" data-background-opacity="0.2" data-auto-animate -->

## example: SpyHide
### the result
 
* SpyHide briefly rebrands as Oospy<!-- .element: class="fragment" -->
* a few days after techcrunch and i published our stories hetzner takes down the spyhide backend server<!-- .element: class="fragment" -->
* paypal is contacted about the paypal account used for spyhide/oospy billing<!-- .element: class="fragment" -->
    * paypal payment option disappears, we do not know if paypal took action<!-- .element: class="fragment" -->
* main known developer is confronted about the paypal account<!-- .element: class="fragment" -->
* oospy goes completely offline<!-- .element: class="fragment" -->
* as far as we can tell they have not come back online<!-- .element: class="fragment" -->
    * this is not a one time thing (see LetMeSpy)<!-- .element: class="fragment" -->

---
<!-- .slide: data-auto-animate data-auto-animate-restart -->

## conclusions

---
<!-- .slide: data-auto-animate -->

## conclusions

* hacking stalkerware works, and gives effective results
* indispensable data for understanding the industry, reporting on it and fighting against it<!-- .element: class="fragment" -->
* it should not be easy and profitable to run a stalkerware business<!-- .element: class="fragment" -->
  * more and more just give up instead of rebranding and keeping at it<!-- .element: class="fragment" -->

---
<!-- .slide: data-auto-animate -->

## conclusions
### morality

legality ≠ morality

Note:
victims need to be freed from, informed about and protected against stalkerware now, not in 10 years when it might be illegal in some places, giving victims and support orgs leverage and evicence to stand against not just their abusers but also the companies enabling and preying on them, we can break the market now

---

<img src="/img/kitten_cropped.png" class="r-stretch"/>

# Q & A with maia
i am unable to answer questions regarding legal proceedings concerning me, don't ask. i will also not answer any other question putting me or others at any unreasonable legal risks.