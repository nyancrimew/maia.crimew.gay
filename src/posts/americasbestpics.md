---
title: "the ifunny clone that isnt"
date: 2023-06-06
description: "god i love fucked up corporate structures"
feature_image: /img/posts/americasbestpics/cover.jpg
feature_alt: "a glitchy edited screenshot of americasbestpics.com"
tags:
    - analysis
    - osint
    - research
    - memes
---

> [this blog post was originally a tumblr post](https://www.tumblr.com/nyancrimew/719391254132195328/entirely-unrelated-to-the-actual-posts-above-but), inline links are sources

so today the following post appeared on my tumblr dash, reminding me of a bit of research i did a while ago.

<div class="tumblr-post" data-href="https://embed.tumblr.com/embed/post/t:S2ywf0MGCBjmJA_wSwOS5A/714797621937618944/v2" data-did="d2737021e2f39854e43e530b165290da48db57e5"  ><a href="https://www.tumblr.com/tchaikovskaya/714797621937618944">https://www.tumblr.com/tchaikovskaya/714797621937618944</a></div><script async src="https://assets.tumblr.com/post.js?_v=38df9a6ca7436e6ca1b851b0543b9f51"></script>

as you can see there is a tiny tiny banner at the bottom of the second posts image. when i first encountered this footer a while ago i got curious, what the fuck is americasbestpics.com? so i checked it out

![a screenshot of the americasbestpics home page, it's a meme website with a feed and various tags you can explore](/img/posts/americasbestpics/screenshot.jpg)

it pretty much just looks like an ifunny clone, huh? specifically advertising to americans? looks interesting, i dug deeper, trying to figure out where their backend is, and how the fuck they have as many posts as they do if i've never heard of them

![screenshot of a developer tools view of the americasbestpics front page, there are various scripts being loaded from an ifunny domain](/img/posts/americasbestpics/devtools.jpg)

wait, huh? what's that? what? ifunny?

![the play store listing for americas best pics showing it is listed by Funtech Publishing LTD](/img/posts/americasbestpics/playstore.jpg)

oh, so [ABPV is run by Funtech Publishing](https://play.google.com/store/apps/details?id=com.americasbestpics7), a company that runs a number of hyperspecific ifunny "clones". wait? [funtech is the word funcorp (owner of ifunny) uses to describe their industry](https://www.smaato.com/resources/case-studies/success-story-funcorp/)? huh?

*digs a bit deeper*

hm [funtech publishing is headquartered](https://opencorporates.com/companies/cy/HE397075) in the same city in cyprus as [funcorp](https://opencorporates.com/companies/cy/HE352942)! hmmmmmmm

![screenshot of company registrations showing Irina Antipina is both a company officer for funtech as well as ifunny](/img/posts/americasbestpics/irina.jpg)

oh huh, wow how curious! [the main company officer registered for funtech publishing](https://opencorporates.com/officers/762300333) also just so happens to be the former ceo/director at ifunny (at the time of them being main officer at funtech), that surely doesn't mean anything

ok so, wait, ifunny runs an ifunny clone, [a shady meme/tiktok clone app where you ?? get paid ?? to use the app?](https://play.google.com/store/apps/details?id=com.zmedia.media.yepp) (which curiously enough is listed under a different company name and corporate structure, while also being on the [funtech website](https://www.funtech.co/)?), [a whatsapp status saver letting u save other peoples statuses](https://play.google.com/store/apps/details?id=com.funtech.kdkd), [some other rly cringily advertised meme focused tiktok clone](https://play.google.com/store/apps/details?id=com.funtech.funxd) and potentially some other apps.

this is not an uncommon practice for smaller advertising business focused mobile app dev studios, but i was really surprised to find ifunny doing this, and especially that they would compete with themselves.