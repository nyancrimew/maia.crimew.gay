---
title: "#FuckStalkerware pt. 1 - the LetMeSpy hack"
date: 2023-06-26
description: "let the games begin"
feature_image: /img/posts/fuckstalkerware-1/cover.jpg
feature_alt: "a glitchy edited screenshot of the landing page for LetMeSpy"
tags:
    - "#FuckStalkerware"
    - stalkerware
    - analysis
    - leak
content_warnings:
    - mentions of abuse/controlling behaviour
---

> the intro to this series can be found [here](/posts/fuckstalkerware-0/)

a few days ago, while i was starting work on this very series, polish stalkerware company LetMeSpy (LMS) got completely pwned and had their databases dumped. the link to the file (`jaki_kraj_taki_finfisher.tar`) was sent my way, and i decided that this would be a fun thing to start this series off with, especially since so far this breach has been barely, if at all, reported on outside polish media.

## so what's in the dump?

the dump contains the following folder structure:

```bash
drwxr-xr-x  0 root   root        0 Jun 21 01:10 letmespy/
-rw-r--r--  0 root   root 66347465 Jun 21 00:08 letmespy/lidwin_lms.sql.zst
-rw-r--r--  0 root   root   191375 Jun 21 00:57 letmespy/decrypted_calls.csv.zst
-rw-r--r--  0 root   root   648027 Jun 21 01:00 letmespy/decrypted_msg.csv.zst
-rw-r--r--  0 user   users  772213 Jun 21 01:10 letmespy/users.csv.zst
```

all the files are compressed using [zstandard](http://facebook.github.io/zstd/), and there is a full phpMyAdmin db dump (`lidwin_lms.sql.zst`), and csv files of decrypted call (`decrypted_calls.csv.zst`) and message (`decrypted_msg.csv.zst`) logs, as well as a convenient csv of user (operator) ids, emails and password hashes (`users.csv.zst`).

## oh, a users table 👀, who used this shit?

after a cursory glance over [all the domains used for user email addresses](/files/posts/fuckstalkerware-1/email-domains.txt), i've come to the following main conclusions:

- 3 government workers have signed up (two from malaysia, one from jordan) 
- D. Morrison from [broussard police](https://broussardpolice.com) has signed up
- at least one person from a competing stalkerware product (which we will get to in due time in this series), has signed up, definitely no "advanced inspiration" happening here

after a cursory glance at the dumped database and call/message logs it however doesn't appear like any of the above users have actually really used the product in any capacity. another concering thing i noticed however in the list of email addresses/domains is just how many US college students appear to be using stalkerware such as this, though i guess it does fit the US college culture to be spying on partners in such a manner. 

## what other stuff is there

alright, so obviously there is the message and call logs, revealing with whom and what all the spied on people have communicated, which so far i have not yet had the time to do a deep dive into, though i might wait with that in general until i have more datasets from various of these apps, but some interesting stuff in there:

- there is obviously logs of various drug trades happening
- god so many people get trump campaign text messages
- there is at least two instances (i only searched in english) of the stalkers admitting to their tracking and calling the person they're spying on out since they think they've just caught them cheating, eg:
  ```csv
  id_msg,id_user,id_phone,type,ip_add,message,number,time_add,timestamp,doublecheck
  63644797,xxxxxx,xxxxxx,0,72.x.x.x,"You cheat,  ",+1xxxxxxxxxx,2023-03-20 19:39:00,1679335679,xxxxxxxx
  63644798,xxxxxx,xxxxxx,0,72.x.x.x,"Your being Tracked I was told your you went to eat, and you r by sams  ",+1xxxxxxxxxx,2023-03-20 19:39:00,1679335858,xxxxx
  ```
  <small>*(redacted by me)*</small>
- i never even really thought about how easy account takeover is with stalkerware installed on your victims phone, you can just request 2fa codes and use them, huh (this seems obvious now)

additionally available in the database are: geolocation logs, ip addresses for each log entry, ip addresses for the operators, phone model, android version, operator payment logs. this data also shows us that there is around 10000 phones registered to be surveilled via this software, though a large part of them seem to have never sent any activity updates.

what i also found in the database is global configuration for the site, which reveals that letmespy is run by [Rafał Lidwin](https://pl.linkedin.com/in/lidwin) ([lidwin@lidwin.pl](mailto:lidwin@lidwin.pl)), which tracks since (according to his linkedin) he's the CTO of [RADEAL](https://www.radeal.pl/), the company that according to the footer runs LMS, he's the first user to have signed up and lidwin appears all over the place.

```sql
--
-- Dumping data for table `glob__settings`
--

INSERT INTO `glob__settings` (`id_setting`, `name`, `value`, `description`, `code`, `time_updated`, `time_add`) VALUES
(1, 'default_name', 'Let Me Spy', NULL, 1, '2013-02-06 17:28:00', '0000-00-00 00:00:00'),
(2, 'default_www', 'letmespy.com', NULL, 1, '2013-02-06 17:28:00', '0000-00-00 00:00:00'),
(3, 'default_mail', 'support@letmespy.com', NULL, 1, '2013-02-06 17:28:00', '0000-00-00 00:00:00'),
(9, 'mail_title', 'Let Me Spy', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(10, 'mail_default', 'support@letmespy.com', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(11, 'mail_reply', 'support@letmespy.com', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(12, 'mail_mailer', 'smtp', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(13, 'mail_host', 'lidwin.pl', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(14, 'mail_port', '25', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(15, 'mail_helo', 'lidwin.pl', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(16, 'mail_smtpauth', 'true', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(17, 'mail_username', 'support@letmespy.com', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(18, 'mail_password', 'xxxxxxxxxx', NULL, 2, '2013-01-11 13:52:00', '0000-00-00 00:00:00'),
(53, 'company_name', 'Rafał Lidwin LIDWIN.PL', NULL, 3, '2013-08-29 09:36:00', '2013-05-24 14:17:00'),
(54, 'company_nip', '675-117-35-37', NULL, 3, '2013-08-29 09:36:00', '2013-05-24 14:17:00'),
(55, 'company_adress', 'ul. Reduta 11A/55', NULL, 3, '2013-08-29 09:36:00', '2013-05-24 14:17:00'),
(56, 'company_zip', '31-421', NULL, 3, '2013-08-29 09:36:00', '2013-05-24 14:17:00'),
(57, 'company_city', 'Kraków', NULL, 3, '2013-08-29 09:36:00', '2013-05-24 14:17:00'),
(58, 'company_bank_name', 'BreBank mBank', NULL, 3, '2013-08-29 09:36:00', '2013-05-24 14:17:00'),
(59, 'company_bank_account', '52 1140 2004 0000 3102 3016 6119', NULL, 3, '2013-08-29 09:36:00', '2013-05-24 14:17:00'),
(60, 'KURS_DATA', '2023-06-19', NULL, 4, '2023-06-20 10:20:00', '2015-01-14 23:29:00'),
(61, 'KURS_USD', '4,0680', NULL, 4, '2023-06-20 10:20:00', '2015-01-14 23:50:00'),
(62, 'KURS_EUR', '4,4457', NULL, 4, '2023-06-20 10:20:00', '2015-01-14 23:50:00');

-- --------------------------------------------------------
```
<small>*(email password redacted by me)*</small>

## what are the ethics of stalkerware leaks like this

it is of course not nice that data collected by spyware without the victims consent is just publicized like this, there is still some nuance to this. there is barely any chance targets of stalkerware will ever be informed of breaches unless data about them leaks and third parties are able to do so. in this specific case it's not even *possible* for LMS to inform targets, since the app has no functionality to talk to targets/notify them as well as no self update mechanism. at best the company can inform operators of this breach and even that is doubtful. what's going to be interesting in this specific case is where the gdpr liability lies, is it on LMS or on the operators to inform victims, if we're lucky this could already be enough to bring them down. 

furthermore as with any datasets of highly personal data, they're highly valuable to various investigative journalism. yes, this is data that ideally would not exist, but it existing means it can be analyzed in interesting ways. datasets of lots of received text messages and calls could reveal political influence campaigns and politicians attempts of buying votes, if high level persons have been spied on it could even reveal corruption, etc. i am of the opinion that most datasets can be used for good in the right hands even if they shouldn't exist at all. also the main thing these datasets will always also contain is information on the operators, on the people who use software such as this for spying on their partners, kids, employees, etc.

this obviously does not mean that there isn't also a massive potential for abuse of data such as this, which is why i will not be linking to any source of it. it's a hard topic to cover and i hope i can do it justice enough in this series, and hopefully dive more in depth on how these companies operate and not just in the data they collect, or this is gonna end up being very monotone.

## final notes

i have reached out to letmespy and rafał lidwin for comment for this post, but have not heard back so far, this story will be updated if i get a statement. furthermore i am still open for tips and leads regarding other stalkerware/watchware software vulnerabilities and leaks or insider infos, as well as requests for comments from journalists, [feel free to contact me](/contact/).