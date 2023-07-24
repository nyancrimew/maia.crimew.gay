---
title: "#FuckStalkerware pt. 2 - SpyHide couldnt hide forever"
date: 2023-07-24
description: "and once again it was way too easy"
feature_image: /img/posts/fuckstalkerware-2/cover.jpg
feature_alt: "a glitchy edited screenshot of the SpyHide dashboard"
tags:
    - "#FuckStalkerware"
    - stalkerware
    - research
    - analysis
    - leak
    - php
    - exploit
content_warnings:
    - mentions of abuse/controlling behaviour
---

> the intro to this series and the concept of stalkerware can be found [here](/posts/fuckstalkerware-0/)

this is a rather technical deep dive into how i hacked [SpyHide](https://cellphone-remote-tracker.com) (sometimes referred to by the shortening CRT, their .com domain) and a bit of [my own analysis](#analysis), for a less technical and more journalistic approach to the breach you can read [this exclusive piece in techcrunch](link).

when i started work on the #FuckStalkerware series i did what i always do first, scanning for super low hanging fruit vulns without expecting much. so as i was running as scan over the target list for .git exposure (which happens when a website is deployed via git but the webserver isn't configured not to serve contents of the .git directory) among various false positives there was an actual hit. using [goop](https://github.com/nyancrimew/goop) (an offensive git dumping tool i originally developed in 2020) i managed to download the full source code and git history for the account panel of SpyHide. 

![the goop command line tool being used to download the source code to account.cellphone-remote-tracker.com](/img/posts/fuckstalkerware-2/goop.jpg)

and so i began digging into the repository, first with a focus mostly on figuring out some background info on spyhide. let's start with some git metadata: a look at the `.git/config` file reveals that the code is hosted in a private repository on the [`virsysplaytech`](https://github.com/virsysplaytech) ([archived](https://web.archive.org/web/20230713150318/https://github.com/virsysplaytech/)) github account.

```ini
[remote "origin"]
	url = https://github.com/virsysplaytech/CRTPanel.git
	fetch = +refs/heads/*:refs/remotes/origin/*
```

the account name says "Arasteh" and the bio reads "CEO of Decima Tech", , which (along with the "virsysplaytech" name above) we should keep in mind, because they also appear in the list of git commit authors (with a slightly different spelling of virsys):

```bash
nyancrimew@meowcbook CRTPanel % git shortlog --summary --numbered --all -e             
   160  mojmadah <mojmadah@gmail.com>
    34  root <root@server.virsis.net>
     1  Arasteh <83481775+virsysplaytech@users.noreply.github.com>
```
so the spyhide site appears to be hosted on a server called server.virsis.net, and we have the only real dev behind their php infrastructure. mojmadah (Mohammad Aresteh, oh here is that name again) is fairly easily googleable, and it turns out his email address has been used to [register various domain names](https://website.informer.com/email/mojmadah@gmail.com) (which given these companies are all called decima* also confirms that virsysplaytech is Mohammad's account). based on further clues in the source code, OSINT, as well as having owned the decima [ERP system](https://en.wikipedia.org/wiki/Enterprise_resource_planning) they used for a bit in 2021 (story for another day), it can also be concluded that Mohammad also goes by Mahdi/Mehdi (مهدى) and the username mahdi110 in various places. i reached out to mohammad for comment via email as well as telegram (where he blocked me) - at the time of publishing i have not received any real response.

so the people involved, as well as the source code and references to a former iranian front for SpyHide (spyhide.ir) is how it at least became clear that spyhide is software by an iranian company called virsys or virsis. and that's about all i managed to gather about the backgrounds of this company from surface research based on the repository, so it's time to move on to the real fun stuff! diving into the source code and...

## finding something to exploit

i got going by just scouring through the source code, pretty much at random, slowly trying to build an image of how their (oh so incredibly shoddy) backend works. lots of the php  seemed unused, were back up copies of now changed scripts (which seems rather unneccessary given the use of git, but i digress) or had `_new` versions. here is a mostly unfiltered look into my research notes of this stage:

auth cookies are in the format of `userid.passwordmd5.lang.timezone.db_type`
 * user ids are sequential
 * yes, the password as represented in the db with the db salt and all is in the cookie
 * db type is either a or b, where b appears to stand for "backup", both my accounts i made on prod are on db type b and a look at the code reveals that this specific auth code doesnt support type a anyways (at least not right now)

for auth via level2 phone app (unclear what that is) an "app key" is required, which is described by code comments as follows:

```php
// $app_key is generated in level2 app hash(md5_pass.username.private_key)
// $u_id will send from level2 app to identify target user
// $tz is level2 app phone timezone
// $lang is level2 app phone default language
```
the mentioned private key (which is actually a static salt) appears to be `asrome_intermilan_realmadrid`, which is of course incredibly creative. 

and suddenly it was starting to get more interesting, i was looking into how data uploads from victim devices works and i found out that the `uploadPhoto` action accepts any kind of files with arbitrary file names, extensions and content. the same thing also goes for the `uploadRecordAmbient` and `uploadRecordCall` actions, where the devs seemingly even realized the potential risk of this:

```php
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

there is a check to only allow `.mp3` and `.3gp` files respectively which clearly references potential hacks, however the check isn't actually used for anything besides a now commented out log message. so even there it would still be possible to upload whatever i want.

the only problem i still had with all off these endpoints is that i needed a victim device registered to my account (or just know any active device id) to make use of them. since i had only just moved flats and not yet unpacked everything i didn't have a throwaway test device at hand to throw stalkerware at, i guess i had to also figure out how to do the api calls to register a device myself. once i managed to understand the confusing logic of different account types this turned out to actually be pretty simple, so i now had a device with the definitely very numeric id `maia`.

all that remained to do now to take over their server is to upload a base64 encoded [php webshell](https://github.com/b374k/b374k) using the `uploadPhoto` endpoint, and as a little extra flex and to make it slightly more convenient to access i also did a directory traversal placing the webshell at `/funky.php`. and baaaaaam

![a screenshot of my full monitor showing the moment i first accessed the webshell as well as various tools](/img/posts/fuckstalkerware-2/funkytimes.jpg)

from now on it was once again all comically easy, i used the webshell's built in explorer to compress all the webroots of the various sites hosted on this server and just downloaded them over http, thankfully their server has quite good bandwidth so this was all done within like an hour. at the same time i found an already existing installation of the [adminer](https://www.adminer.org/) database management tool in one of the webroots, which allowed me to trivially dump all of their databases.

welp, now im sitting on like 230Gb of stalkerware data to go through, source code, databases and even photos, call and ambient audio recordings from victim phones.

## analysis

as always i did my quick surface analysis to have a better idea of how to pitch this story to journalists who will then be way more qualified in the actual analysis of the data. spyhide had almost 800k user accounts, email addresses are not verified (so also keep that in mind for upcoming analysis) with data ranging from late 2016 to now, there are around 60k devices which have been compromised during those years. for once it should be somewhat possible to identify lots of the victims as there is IMEI info for all devices + phone numbers for lots of them.

some of the users (operators) have multiple devices connected to their account, with some having as much as 30 devices theyve been watching over a course of multiple years, spying on everyone in their lives (sidenote: there is some sad irony to naming the device of someone you're stalking for literal years accross multiple phones with "\<name\> the crazy", like idk whos the fucked up one here).

i once again obviously also searched the email address and [email domain list](/files/posts/fuckstalkerware-2/email-domains.txt) (once again public, but since there is no email verification there is lots and lots of typoed and fucked up domains this time, also the script i used to make this list fucking sucks) for interesting email addresses, which in my book as always mostly means government email addresses. there are at least 190 users who have signed up with various government email addresses, at least 16 of which are US goverment addresses (there is even some .mil ones in there this time), many of which were correctional officers (use of commercial spyware in parole/house arrest ??), a massive amount of users from the brazilian and philippine departments of education, as well as 5 users from the colombian national police, indicating they at the very least seem to have evaluated commercial spyware at one point.

spyhide also appears to keep data around for way longer than they even tell the operators, for photos and audio recordings they claim that all data will be deleted after 3 months, however i have found photos as well as recordings from all the way back in mid 2022. this data appears to only actually be deleted from storage when devices "expire", as in the operators stops paying for the subscription or they have been disconnected for a specific amount of time.

## a small "bonus"

here is the "tizer" \[sic.\] for spyhide which they put on their website, it's incredibly hilarious to me so i had to share it

<video controls>
  <source src="/img/posts/fuckstalkerware-2/tizer.mp4" type="video/mp4">
</video>

i dont think ive ever seen a product ad that was as over the top and as 2013-minecraft-core as this. "spyhide .. presents .. cheating on you" is just burned into my mind as the funniest marketing phrasing ever. their marketing does also just straight up admit to how their software is intended to be used for spying on partners without consent, it's wild how incredibly forward they are about that.

## developments since i started writing this

on the evening of sunday the 23rd i noticed that i could no longer sign into my testing account at spyhide, it appears that virsis has "responded to my request for comment" by closing up at least some of the holes. sign ups were disabled (except i think through the app ?), some database password were changed, my webshell removed and my account deleted. a quick check with goop shows that .git is still exposed and nothing else (including the arbitrary file upload) has been fixed.

the data from this leak will be available soon in limited distribution to other journalists and researchers via [DDoSecrets](https://ddosecrets.com) (please [support them financially](https://ddosecrets.charity)), this article will be updated to reflect that once that is the case. as always feel free to [contact](/contact) me with any tips, data, vulnerabilities, industry insider info (for this series and just in general) or for journalistic inquiries.