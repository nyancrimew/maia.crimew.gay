---
title: "stalkerware hack unveils massive potential fraud scheme"
date: 2024-05-30
description: Wyndham would be at least the second hotel chain hit with this
feature_image: /img/posts/wyndham-defrauded/cover.jpg
feature_alt: a glitchy edited photo of a wyndham hotel in las vegas
feature_caption: "photo credits: [Harrison Keely](https://commons.wikimedia.org/wiki/File:A_Wyndham_resort_in_Las_Vegas,_Nevada.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0), via Wikimedia Commons"
tags:
  - "#FuckStalkerware"
  - stalkerware
  - research
  - analysis
  - leak
  - security
  - investigation
---

*this is a follow up story on [the massive pcTattletale hack](/posts/fuckstalkerware-6/).*

when you search for "pcTattletale" in US federal court systems, just one case comes up: [*US v. Patel*](https://www.courtlistener.com/docket/63158296/3/united-states-v-patel/), filed in 2021, details a three-year-long scheme in which Chirag Patel and his accomplices defrauded a large US hotel chain. pretending to be IT administrators, they called hotel front desks and convinced employees to give them remote access to their computers. they then grabbed sensitive information immediately present and installed pcTattletale or other commercially available spyware. using the continued access, Patel would finally obtain passwords to internal hotel systems, steal guest credit card details and transfer loyalty points. however, this isn't the fraud case we're going to be talking about today.

when Eric Daigle [discovered a bug in pcTattletale](https://www.ericdaigle.ca/pctattletale-leaking-screen-captures/) last week that let him access arbitrary victim screen recordings, one of the first things he and TechCrunch reporter Zack Whittaker discovered was [a number of check-in computers at Wyndham hotel locations](https://techcrunch.com/2024/05/22/spyware-found-on-hotel-check-in-computers/). Wyndham gave no specific comment on the use of pcTattletale, instead asserting that "Wyndham is a franchise organization, meaning all of our hotels in the U.S. are independently owned and operated." and while we guessed the software might have been used for employee tracking, Booking.com instead told TechCrunch that "[s]ome of our accommodation partners have unfortunately been targeted by very convincing and sophisticated phishing tactics."

so when pcTattletale got completely breached and all their data dumped online, and as we finished up [our initial reporting](/posts/fuckstalkerware-6/), Zack, Eric and i were still wondering about one thing: is it possible that all the affected Wyndham computers are actually being spied on by hackers rather than by employee-monitoring administrators? i started digging into the leaked database, trying to find answers. pretty quickly i began seeing a number of patterns that reminded me of the *Patel* case (i found the victim to have been american chain Choice Hotels using the data); all *nine* different pcTattletale accounts spying on Wyndham hotels are just linked to random gmail addresses, and most of the device descriptions in the database are just a combination of the hotel brand and location such as "super8 evansville" or "DAYSINN AMARILLO".

![a screenshot of some of the Wyndham data in the leaked database](/img/posts/wyndham-defrauded/screenshot.jpg)

i still wasnt entirely convinced this was fraud, however, until i started seeing the device descriptions that began straight-up copying reviews of the hotel locations—{%  footnoteref "tofu", "the missing character is due to some character encoding issues in the pcTattletale database" %}"4p. F.P. Euros Barrie�s are yummy too $\$"{% endfootnoteref %}—or were just super short—"Doodoo" (i guess that Wyndham location wasn't to taste). other descriptions explicitly talk about credentials/access that are still missing, including "need security questions", "Need Fb password", "NEED [SUPER8] EMAIL". all in all, almost 270 computers at Wyndham locations had pcTattletale installed at some point, some of them going back to 2022 and with most spying seemingly going unnoticed until this data leaked.

[OSINT](https://en.wikipedia.org/wiki/Open-source_intelligence) analysis of the email addresses shows that most of them were not connected to any other accounts, likely acting as burners, though one of the emails—which monitors 41 of the devices in locations across the US—seemingly belongs to the general manager of a single Wyndham hotel location.

it's of course impossible to conclusively say whether any of this is actually a case of Wyndham getting defrauded or not, and it's especially impossible to conclusively figure out who's behind the pcTattletale accounts, but its similarity to past schemes is undeniable and the way pcTattletale is mostly being used here would make little sense for internal company use. if the spying is indeed being conducted by malicious actors, it would serve as a pretty bad testament for Wyndham's cybersecurity practices; despite the corporation likely having little visibility into individual franchise computer systems, it absolutely shouldn't take over two years, 270 affected devices and a journalist inquiry for them to detect an intrusion of this scale. it's an especially bad look after an [2015 FTC settlement (regarding unrelated data breaches) ordered them to establish proper cybersecurity procedures](https://www.reuters.com/article/idUSKBN0TS2AX/) in order to protect customer personal and payment data. i reached out to Wyndham for comment, but have yet to receive a response at the time of publishing.

none of this is really surprising either: if we allow for commercial spyware to be this easily accessible, people *are* going to use it for crime. as a matter of fact, i'd imagine this is only the tip of the iceberg in terms of non-stalking crimes carried out using stalkerware and we're going to keep finding more examples of this as more data from stalkerware providers becomes available.

*if you have any data, insider info, vulnerabilities or any other tips related to stalkerware (or in general) you can securely reach out either to [me](/contact), [Zack Whitaker from TechCrunch](https://techcrunch.com/author/zack-whittaker/) or [Eric Daigle](mailto:hi@ericdaigle.ca).*