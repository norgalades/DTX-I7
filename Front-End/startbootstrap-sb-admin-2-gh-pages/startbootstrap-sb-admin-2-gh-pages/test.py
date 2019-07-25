#!/usr/bin/env python
# encoding: utf-8

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

smtp_host = 'localhost'
smtp_port = '25'
mail_from = "i7@ge.com"

html = """\
<html>
  <body>
    <p>Dear Merkur Offshore user,<br>
       One of your turbine is offline.<br>
       Please, acknoledge the alert as soon as possible.
       The i7 team stays at your disposition for any help.<br>
    </p>
  </body>
</html>
"""

mail_to = "mic.lecce@gmail.com"
msg = MIMEMultipart()
msg['Subject'] = "Turbine is offline!"
msg['From'] = mail_from
msg['To'] = mail_to
msg.attach(MIMEText(html, 'html'))

s = smtplib.SMTP(smtp_host, smtp_port)
s.sendmail(mail_from, mail_to, msg.as_string())