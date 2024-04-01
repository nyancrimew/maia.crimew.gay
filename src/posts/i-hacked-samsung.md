---
title: "so i guess i hacked samsung?!"
date: 2024-04-01
description: "it's not quite xz but at least my grandma knows what samsung is"
feature_image: /img/posts/i-hacked-samsung/cover.jpg
feature_alt: "a glitchy edited image of clouds and a screenshot of samsung cloud accompanied by their logo"
tags:
    - bug bounty
    - leak
    - security
    - infosec
    - jenkins
    - cloud
---

having just finished a full draft of the [latest stalkerware article](/posts/fuckstalkerware-4/), i decided to wind down in the most "maia&trade;" way possible and, just like [when i discovered the no-fly list](/posts/how-to-hack-an-airline/), i started going through random jenkins servers on [zoomeye](https://zoomeye.org) to pass the time. there were a few mildly interesting targets, but nothing that really caught enough of my attention to stop and do any deeper research (i'll probably get back to some of these in the future, don't worry). that was until i clicked on a south korean microsoft azure server, still not expecting much until firefox hit me with a warning that the https certificate of the site i was accessing via its IP address is only valid for "\*.samsungcontinue.com". wait a sec. samsung? holy fuck is this samsung?

![a screenshot of the job configuration screen in jenkins; it shows that a repository is being cloned from the samsung ecode github](/img/posts/i-hacked-samsung/jenkin.jpg)

adrenaline immediately rushed through my entire body, if i can get just about anything out of this it would be massive. checking the project configurations i saw a connection to samsungs github enterprise instance and thanks to the anonymous admin privileges (as always) i could grab the github access token for the used bot account. using that to list all repositories that account has access to it became clear just how much samsung cloud stuff i was about to gain access to.

![screenshot of a terminal showing me using curl and jq to get a list of repositories from the samsung ecode github api](/img/posts/i-hacked-samsung/github-api.jpg)
![screenshot of a heart rate graph, showing a peak at around 1am with my heart rate averaging at 144bpm, the peak being 192bpm and the low being 96bpm](/img/posts/i-hacked-samsung/awesome-maia-heart-rate-leak.jpg)

with my heart rate rapidly raising all the way up to almost 200bpm and my hands shaking, i wanted to gain a better understanding of the actual impact: i cloned all the repositories, wrote a quick script (see below) to switch to each repo's most recently edited branch (the main branch was empty on most of them), and started going through the around 130 repositories to figure out what exactly i was looking at. 

```bash
#!/bin/bash

# iterate over all repositories (subdirectories) in the organization directory
# if you are using this for your own usecase just modify the path here
for repo in SamsungCloud/*; do
	# we use `git -C` here to run commands in each repository without having to manually cd in and out

	# find last edited branch (including remote branches)
	branch="$(git -C $repo branch -av --sort=committerdate --format='%(refname:short)' | tail -n1)"

	# checkout that branch (note that for remote branches this will create a loose head,
	# rather than a local branch referencing the origin)
	git -C $repo checkout $branch
done
```

checking out folder after folder i found more and more [ansible](https://en.wikipedia.org/wiki/Ansible_(software)) modules, one for each samsung cloud service, as well as the [terraform](https://en.wikipedia.org/wiki/Terraform_(software)) configurations for much of samsung amazon aws network and source code for various in-house infrastructure and operations tools. while this isn't quite as big of a dataleak as i'd hoped for it's still pretty damn bad, it gives me (or a potential bad actor) a unique insight into the internals of samsungs backend infrastructure and tech stack. it is also only thanks to the jenkins server in question being so new (and barely set up) that i wasn't able to gain access to more data or move laterally—the server still wasn't at all integrated into the internal samsung cloud network—and with the hashicorp vault setup on the server being broken i wasn't even able to access the amazon s3 store containing built artifacts for every single samsung backend service. it would have however most likely been possible for me to backdoor the server and play the long game, waiting for the system to be fully set up, while retaining access even if it had been secured more properly in the meantime. with potential access to both repositories as well as the build process (it's [supply chain attack season after all](https://boehs.org/node/everything-i-know-about-the-xz-backdoor)) this would have likely allowed for backdoors in further Samsung Cloud infrastructure with widereaching consequences. as it stands though i just had a brief glance into the insides of a tech megacorp before reporting the issue so i could write about it here, learning that just like many of their peers samsungs backend primarily consists of [spring framework](https://en.wikipedia.org/wiki/Spring_Framework) apps hosted using [tomcat](https://en.wikipedia.org/wiki/Apache_Tomcat) and spread across an obscene number of different servers.

oh and before any of you get scared, no i am not becoming yet another shitty bug bounty influencer now, more in-depth investigative journalism is coming again very soon :p

## disclosure timeline

* **2024-02-09:** vulnerable jenkins server found, analysis started
* **2024-02-10:** disclosure email is sent directly to Samsung employees involved with the jenkins server
* **2024-02-14:** employee acknowledges the report, internally redirects it to Samsung Mobile Security
* **2024-02-14:** Samsung Mobile Security contacts me, urging me to re-report via their rewards program
* **2024-02-14:** more in-depth report sent to Samsung Mobile Security
* **2024-02-15:** Samsung security analysis begins
* **2024-02-20:** Samsung Mobile Security updates the report, confirming severity as *High*
* **2024-02-23:** {% footnoteref "samsung-early-access", "this did not influence the contents of this article and no changes were requested or made beyond removing mentions of the specificy bounty reward amount" %}Samsung is provided with a draft of this article{% endfootnoteref %} 
* **2024-03-04:** i am awarded a bounty by Samsung based on a not yet public server vulnerability bounty policy
* **2024-04-01:** this write-up is published and the issue publicly disclosed