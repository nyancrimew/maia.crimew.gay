---
title: "#FuckStalkerware pt. 6 - tattling on pcTattletale"
date: 2024-05-26T05:52:00+2
changed_date: 2024-05-26T13:45:00+2
description: spy gets hacked while spying on himself, hilarity ensues
feature_image: /img/posts/fuckstalkerware-6/cover.jpg
feature_alt: a glitchy edited screenshot of filezilla
tags:
  - "#FuckStalkerware"
  - stalkerware
  - research
  - analysis
  - leak
  - php
  - aws
  - exploit
  - security
  - backdoor
content_warnings:
  - mentions of abuse/controlling behaviour
---

[Bryan Fleming](https://www.linkedin.com/in/bryan-c-fleming/) comes off as the average marketing guru from michigan, even if he's oddly obsessed with the rather specific field of online lawncare marketing. but he has a side venture: for over two decades now, he's been a player in the stalkerware industry as well. he originally acted as a contractor that wrote the stalkerware code for pcTattletale (registered as `Parental Control Products, LLC`). it was originally owned by [Don Schnure](https://www.linkedin.com/in/donschnure/), who Fleming would become close business partners with—so close, in fact, that Fleming would score himself a 50% revenue share of the company before his total buy-out in 2012. taking both Schnure's role as its director and his original role as its programmer, it became a one-man operation he still runs to this day. in the last decade, he's transformed the business from a simple child or employee monitor to software marketed for spying secretly on spouses, though recent changes have eased the marketing back to suit the original purpose.

what sets pcTattletale apart from most other stalkeware products is that it also supports windows PCs on top of the typical mobile phones, and its main feature is a live feed of screenshots from the victim's device besides the usual tools like access to location data. of course, this private information has been repeatedly exposed via two separate [IDOR](https://en.wikipedia.org/wiki/Insecure_direct_object_reference) vulns: one from [2021](https://www.vice.com/en/article/m7ezj8/stalkerware-leaking-phone-screenshots-pctattletale) in which individual amazon s3 urls was found to be guessable (though difficult), and another from just a few days ago in which researcher [Eric Daigle](https://www.ericdaigle.ca/pctattletale-leaking-screen-captures/) found a bug in the api that greatly simplified access to this sensitive data across any registered device. this recent discovery led to Daigle and TechCrunch discovering a [number of businesses](https://techcrunch.com/2024/05/22/spyware-found-on-hotel-check-in-computers/) using pcTattletale to monitor computer activity. {% footnoteref "wyndham-ftc", "Wyndham previously settled with the FTC in 2015 over unrelated earlier data breaches and was <a href=\"https://www.reuters.com/article/idUSKBN0TS2AX/\">ordered to properly secure customer payment information going forward</a>." %}this most notably included various hotels owned by Wyndham whose check-in computers had pcTattletale installed, leaking personal and partial guest credit card and personal information in the recorded screenshots{% endfootnoteref %}. 

## to shreds, you say?

just a day after the TechCrunch article came out, an unrelated hacker found yet another bug in pcTattletale which allowed them to gain full access to the backend infrastructure, causing the websites for both pcTattletale and Fleming's marketing business to go offline and being replaced with a short writeup on how the hack happened and links to all the server data. in it, the hacker remarked that it took them all of 15 minutes to discover the bug: the pcTattletale client api returns raw aws credentials. it's intended to allow screenshots to be directly uploaded to the storage bucket, which is already terrible enough on its own, but it's worsened by the fact that these credentials are the same for all devices and provide full unscoped access to Fleming's aws infrastructure. im honestly surprised that no one has noticed this before, especially when the desktop version of the client ships with the aws s3 library as an obvious sidecar dll that should've raised concerns long ago.

when going through big dumps like these under intense time pressure (given there was a public deface i only have so much time for research), i like to start with a broad sweep, trying to gain an understanding of what's where and how it all goes together. after going kinda mad pouring through the data for 15 hours straight last night, the vastness of it all became clear: pcTattletale currently holds over **17 terabytes** of victim device screenshots (upwards of 300 million of them from over 10 thousand devices), with some of them dating back to 2018.

the sheer amount of data means that the released data dump does not contain any of the screenshots, but it does contain just about everything else: database dumps, the full webroot for the stalkerware service and the contents of various other s3 buckets. the webroot includes a massive dumped home directory, full of random directories and files that sometimes haven't been touched in over a decade. besides the backend files they also contain lots of other stuff such as documents pertaining to topics as far back as the Schnure days, including the contract defining the business partnership between Fleming and Schnure and a letter from a legal firm responding to an inquiry about potential liability related to the sale of spyware.

![a screenshot of the start of a letter from schnure's lawyer](/img/posts/fuckstalkerware-6/legal-letter.jpg)

## backdoored for over a decade???

something even more surprising i found in the php backend code, however, was a super simple webshell hidden in an unassuming subfolder. it tries to masquerade as a part of the backend but the obfuscated part of the tiny shell lets anyone execute abitrary php code by simply setting a cookie. what makes this file such an interesting find, though, is that the shell has been present *since at least december 2011* (which is when the site got moved to its current server). it is impossible to tell whether this shell was placed there by pcTattletale (for whatever reason) or by a threat actor; either way, it reveals that pcTattletale has been backdoored for basically forever and may have had data exfiltrated from it for years by external actors. i could not reach out to Fleming for comment in time for this article, so questions about this remain open.

## the impact

to make my impact assesment a bit easier i filtered the database down to just affected devices and users, searching for interesting keywords and going through all email domains one by one to find notable companies and individuals in the breach. one of the first things i found was a pattern of Fleming regularly installing his own spyware on both his personal and work devices for testing and then leaving it on there for hours or even days, allowing for a unique look into the operation of a stalkerware business. from numerous recordings of his phones over the years i first learned that Fleming has probably a dozen different cryptocurrency wallets and while i unfortunately never got to see the balance on any of them, his cryptobro twitter account and [yacht named "Liquidity"](https://www.instagram.com/liquidityyacht/) ([archive](https://archive.is/O7xo8)) definitely corroborate this obsession.

![a screenshot of Fleming's twitter profile where he posts the same bitcoin inflation joke over and over again with slight variations](/img/posts/fuckstalkerware-6/inflation-be-like.jpg)  

one of the sequences of screenshots from Fleming's computer allowed me to view parts of his evernote account, including a note from early 2023 entitled "Plan to Remove Bad Actors and Misuse of pcTattletale". the short visible excerpt speaks of the plan having been discussed with someone (presumably a law enforcement officer) during a "Search Warrant". while i have no further information about the case in question, this leads me to believe that Fleming may have started to face potential legal consequences for some uses of pcTattletale. this could also explain the marketing pivot around that time from spouse-stalking to employee and child monitoring, which are unfortunately more legally and socially acceptable.

besides Fleming himself, i largely ignored private use of the software, as [i have covered similar incidents before](/posts/tagged/fuckstalkerware/). instead, i focused on the unique and far more interesting part of this breach: the amount of corporate users of pcTattletale. notable examples include:
* even more hotels
* law firms, with some sequences showing confidential lawyer-client communications and client bank-routing information
* a bank with various locations across the US, showing large amounts of confidential client data
* schools and childcare centers monitoring employees or students, revealing both student and parent personal data
* health care providers, revealing confidential patient data
* at least one employee of a palestinian goverment agency
* the HR department of a boeing supplier (yes, they supplied parts for the 737 MAX), revealing employee personal information
* just incredible amounts of screenshots containing credit card information, passwords, photos of identification documents (including Fleming's drivers license) and other highly sensitive personally identifiable and payment information
* point-of-sale systems for a local restaurant chain, showing partial customer credit card and personal information
* a number of companies (especially in tech) who appear to be selectively and secretly installing pcTattletale on employee devices when they are suspected of some sort of wrongdoing; lots of internal systems and source code are exposed in various recordings
* a bug bounty hunter who installed this software on their personal device, presumably for pentesting; the entire hour-long sequence consists of them first installing and then immediately trying to figure out how to uninstall the app again

## the aftermath

it took Fleming over 20 hours to take the defaced website offline, but the long time was not for lack of trying: *his own spyware* recorded him clumsily attempting to restore the site fairly early on but ultimately failing to do so. while pcTattletale itself has now been entirely down for a few hours, the sending of screenshots to the s3 bucket (which appears to be at least somewhat independent from the rest of the backend) continued until Flemings aws account was locked down by amazon shortly before publishing this article. whether the software will be back and what the consequences for the company and Fleming could be is unclear, but the FTC has previously ordered another US stalkerware developer [to cease spyware operations entirely](https://techcrunch.com/2021/09/02/spyfone-ftc-stalkerware/) after they suffered a breach of their own. with pcTattletale's leak affecting a wide variety of companies and being significantly more egregious in its lapses in security, i would expect something similar to happen to them as well. either way, Bryan Fleming has lots to answer for and a lot of work ahead if he wants to repair his image.

*correction: an earlier version of this article falsely implied that pcTattletale aws credentials were revoked by Fleming himself, when instead his account was locked down by amazon*

*if you have any data, insider info, vulnerabilities or any other tips related to stalkerware (or in general) you can securely reach out either to [me](/contact), [Zack Whitaker from TechCrunch](https://techcrunch.com/author/zack-whittaker/) or [Eric Daigle](mailto:hi@ericdaigle.ca).*