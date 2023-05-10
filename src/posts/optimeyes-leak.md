---
title: "infosec company owned completely by 4chan user"
date: 2023-05-10
description: "risk visualize deez nuts"
tags:
    - security
    - infosec
    - jenkins
    - analysis
feature_image: /img/posts/optimeyes-leak/cover.jpg
feature_alt: "a screenshot of a 4chan leak release post"
---

yesterday evening an anonymous 4chan user dumped a leak on the /g/ technology board, claiming to have completely owned risk visualization company [optimeyes](https://optimeyes.ai):

<blockquote>
<span class="greentext">> be cyber security risk assessment company</span></br>
<span class="greentext">> focus on intellectual property theft</span></br>
<span class="greentext">> dont secure ur own systems at all</span></br>
owned completely</br>
<span class="greentext">> have all ur data dumped in a 4chan green text</span></br>
magnet:?xt=urn:btih:03386cd3a22b094cd830853b6577a3197b55225f&dn=optimeyes%20dump%202023
</blockquote>

optimeyes is a company that is focused specifically on "cyber risks", and bolster their ability in visualizing and helping prevent IP theft. which makes it all so much more ironic how completely they have been hacked. as someone who loves a good bit of trolling against the infosec community, i obviously had to download the leak and take a look myself. it turns out it contains not only all the source code for the optimeyes platform, but also tons of customer data, the fully trained ML models optimeyes is built on and tons of hardcoded credentials for their infrastructure. one would think their product would have at least caught that bit in their own software, but oh well! 

## how this leaked

at this point i was very much invested in this leak already, and i had a bigger and bigger suspicion as to how this probably leaked. with some simple shodan searches based on the names of git repositories in the leak i was very quickly able to find a jenkins instance belonging to optimeyes. bullseye. 

at first glance their jenkins instance seems fairly well locked down, barely any viewable workspaces, locked down admin permissions, etc. however, they made one of the most comedic mistakes you can still make while setting up jenkins (im actually not sure which misconfiguration leads to this): the build information for each past build contains a link to the git repository, including the bitbucket credentials in the url. genius.

![a screenshot of a past build in jenkins, showing that the repository url leaks git credentials](/img/posts/optimeyes-leak/jenkins-oopsie.jpg)

this also further backs up my theory of this jenkins being the source of the leak, the git config of the repositories in the leak make use of the exact credentials leaked on jenkins.

## so what's the value of this leak

i honestly dont think much of big value is going to be coming out of this leak directly, but it's a great and hilarious lesson in cybersecurity. the probably highest value assets in the leak is the customer data, which includes server inventories and vulnerability scans from inside customer networks (which appears to include hitachi energy). i have not checked out the database backups in the leak at all yet, but those might be quite devastating for customers as well depending on whats stored in there.

for optimeyes directly this leak could be devastating, so many of their credentials are here (seemingly their whole aws infrastructure is vulnerable), all their intellectual property has leaked and they lost massive amounts of customer data. im curious to see if and how they plan on recovering from this.

this very much seems like a leak that was done for the lulz more than anything else, and it's always fun to see more of that again :3

> some earlier, shorter analysis of this leak can also be found on the [sizeof(cat) blog](https://sizeof.cat/post/optimeyes-leak/)