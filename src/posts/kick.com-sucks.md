---
title: "kick.com sucks - a brief security overview"
date: 2023-08-02T18:20:00+2
changed_date: 2023-08-02T20:45:00+2
description: "or, the tale of a funky write-up"
tags:
    - security
    - infosec
    - analysis
feature_image: /img/posts/kick.com-sucks/cover.jpg
feature_alt: "a glitchy edited screenshot of the kick.com homepage"
---

a few days ago an anonymous (the adjective, not the hacking collective) group of researchers reached out to me regarding a write-up they made i might be interested in covering. interestingly enough their write-up about how twitch competitor [kick.com](https://kick.com) isn't very secure was hosted on a kick.com subdomain - my interest was piqued. 

### the curious case of the write-up

the [link to the write-up](https://files.kick.com/tmp/66a348a9-08ac-48fd-87c9-100fa537c1b6) (now taken down, [archived](https://web.archive.org/web/20230801182040/https://files.kick.com/tmp/66a348a9-08ac-48fd-87c9-100fa537c1b6), more on why this is broken in a bit) i was sent was seemingly hosted on files.kick.com, the cdn used by kick. furthermore the group explained to me that to allow them to anonymously update the write-up without the link changing, they actually use a TOR to clearnet proxy, so the actual page is hosted on an onion site ([gk3eisnvj45msa5fo7kvd4betop6zmoiplena64lowncgdcsktoo6jad.onion](http://gk3eisnvj45msa5fo7kvd4betop6zmoiplena64lowncgdcsktoo6jad.onion), [clearweb (onion.re) mirror](https://gk3eisnvj45msa5fo7kvd4betop6zmoiplena64lowncgdcsktoo6jad.onion.re)) and loaded via [corsproxy](https://corsproxy.io/) and onion.re/tor.pm, which is also why the actual content of the write-up won't display on archive.org. and with that curiosity out of the way it's time to properly go over the write-up titled "Considering using Kick? Think again". block quotes (the indented quotes) in the following blog post will be verbatim sections from the write-up.

### first vuln: chat message fabrication

> "We first looked over Kick's user interface with DevTools, and noticed when pinning a message, the entire metadata of the message gets sent with it. When you modify said payload to include a fake username/content/badges, the server will blindly accept it, allowing you to impersonate any chat member. Incredible!"

this sounds fun! so i went ahead and tried to replicate it:

#### step 1: record a request

in went ahead and begrudgingly created a kick account to test the things laid out in the write-up. i then opened the chat on my own channel, sent a message and with the dev tools network tab open pinned it to the chat to record the payload sent.

![a screenshot of the kick.com chat UI as well as the dev tools network tab showing the json payload for pinning a message](/img/posts/kick.com-sucks/fabrication-step1.jpg)

#### step 2: editing and replaying

since i didn't wanna bother bypassing cloudflare in any capacity just for this quick proof of concept, i decided to just use the built-in firefox "Edit and Resend" feature to replay the message pin payload. i edited the sender of the message, the message contents, added a silly little verified badge and hit send :3

![the firefox "edit and resend" feature in action showing an edited pinned-message request](/img/posts/kick.com-sucks/fabrication-step2.jpg)

#### success: it really is just that easy huh

well, here we go, finally proof that the definitely very real (as evidenced by the verification badge) tyler "ninja" blevins meowed in my kick chat! i had to pin that one for sure !!

![a screenshot of a pinned message in a kick chat reading "meoow" it was apparently sent by "ninjafortnite" and next to the message there is a broadcaster as well as verification badge](/img/posts/kick.com-sucks/fabrication-success.jpg)

the limitation of this vuln is that message fabrication is only possible for moderators of any given channel, though the fact that it applies specifically to pinned messages means there is still a lot of potential for scams and fraud here

#### reply fabrication

upon asking the group for confirmation that the pin based message fabrication only works for channels you have pin permissions in, i was told that their chat reply implementation also allows for fabrication, so i quickly reproduced that as well.

so im once again grabbing the payload (by replying to a random message on a random featured stream)

![a screenshot of the json payload of me replying to a random message in a chat](/img/posts/kick.com-sucks/fabrication-reply1.jpg)

and then replaying it on my own channel with edited contents and sender

![a screenshot of me replying to a message by @ninja saying "meow", my message reads "holy shit ninja"](/img/posts/kick.com-sucks/fabrication-reply-success.jpg)

damn, tyler "ninja" blevins really loves meowing :3

in the past this apparently worked on arbitrary channels - the api even still returns a success message, confirming message creation, but nothing appears in chat. now it only does on your own channel which certainly is an extremely weird mitigation strategy.


### let's just responsibly disclose this i guess

> "We first debated about trying to responsibly disclose this vulnerability, the side of this is that Kick is heavily funded by Stake, a illegal online crypto casino, which is very legally and morally questionable. The debate ended up in us atleast trying to find a security contact... we found none. That's why we're writing this document instead of contacting Kick privately - we can't."

not only do kick and stake make it incredibly hard to even try to responsibly disclose vulnerabilities, they are also "known to ignore security vulnerabilities and pursue legal action against whistleblowers instead of fixing them," according to the group. this is why their write-up has been published anonymously and sent to me to report on. in a conversation the group told me they were further motivated to not responsibly disclose as to not support a platform "specifically made to promote illegal gambling \[content\], since twitch blocked it." so their research continued...

### second vuln: arbitrary file write / XSS

> "While digging into saving profile pictures for some sort of vulnerability, we found that **Kick** implemented [Larevel's Vapor upload system](https://docs.vapor.build/1.0/resources/storage.html#file-uploads) incorrectly. This gave anyone full control of the content type and extension (allowing you to upload more than just images). These files were hosted on a domain in-scope for **all Kick.com cookies!**. Since Kick was pretty short sighted, they decided to make all authentication tokens accessible on all subdomains."

the write-up itself, hosted on files.kick.com using this vulnerability, is the proof of concept for this vuln. to showcase the loose cookie access control there is also a button which (when clicked on the files.kick.com version) displays all of your kick.com cookies, showcasing the potential for XSS and token stealing

![a screenshot of the write-up showing a popup displaying all my kick.com cookies](/img/posts/kick.com-sucks/xss.jpg)

given that the write-up itself already definitely proved the viability of this vulnerability, and i had been shown a video by the group showcasing the vulnerability in action, i decided not to reproduce this one myself.

### third vuln: arbitrary file read / improper aws access control

> "So, you know that domain from earlier? Yeah, `files[.]kick[.]com`. Turns out, the main user content bucket was publicly viewable by just going to the [root of the domain](https://files.kick.com/)! Fun, am I right? All your user uploaded content available to the public, but it gets worse! It doesn't even get removed if you delete it. That probably breaks some privacy law, but we're too lazy to investigate."

i also verified this one myself by checking the bucket (`kick-files-prod`) contents using the [aws cli](https://aws.amazon.com/cli/), and have started archiving as much of the bucket as i can (at the time of writing that is around 50+gb of mostly user generated content). a quick check verifies that at the very least the bucket does not allow for public write or delete access; publicly allowing read access is still pretty bad nevertheless.

### conclusion

> "Kick is definitely not a better alternative to Twitch, and this is not even all of the flaws we found. Some of them would be even more dangerous to publish publicly. It's incredible how streamers like to go on every platform without doing the smallest bit of investigation.  
> [...] I know Twitch sucks, but this really isnt the alternative. A small startup could do better then this. Use YouTube gaming, theyre pretty cool, and we'd rather trust Google instead of a Gambling comp with shit security.  
> Or you know, [self host your streams..](https://owncast.online/)"

i definitely agree with this sentiment. i am also very curious regarding further trivially found vulerabilities (including the ones teased in the write-up), and im hopeful this write-up and my blog post can inspire some more interesting security research on kick.com, making it at the very least somewhat more secure hopefully. morally i also fully agree that trusting a platform which primarily exists to promote gambling and gambling content, owned by one of the biggest players in that industry, is foolish, no matter how good their creator payouts may be. this is further evidenced by how the only channels i saw ever having more than maybe 2000 viewers on kick during this investigation were famous gambling content creators, no other category ever seemed to garner much views. 