import os
from pathlib import Path
from email.mime.image import MIMEImage
from django.template import Context
from django.template.loader import render_to_string, get_template
from django.core.mail import EmailMessage, EmailMultiAlternatives

from django.utils.encoding import force_bytes, force_text, DjangoUnicodeDecodeError
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.conf import settings


class EmailAlert():
    sender = settings.DEFAULT_FROM_EMAIL_NO_REPLY

    def __init__(self, recipient, username, content):
        self.username  = username
        self.recipient = [recipient]
        self.content   = content
        self.content.update({ "EMAIL_APP_NAME": settings.EMAIL_APP_NAME, "sender": self.sender })


    def send_email(self, template, subject, text, content):
        html = get_template(template).render(content)
        msg = EmailMultiAlternatives(subject=subject, body=text,
                                     from_email=self.sender, to=self.recipient)
        if html:
            msg.attach_alternative(html, "text/html")
        msg.send(fail_silently=False)


    def send_activation_email(self):
        subject   = settings.EMAIL_USER_ACTIVATION_SUBJECT.format(**self.content)
        text      = settings.EMAIL_USER_ACTIVATION_BODY.format(**self.content)
        return self.send_email("frontend/user_activation.html", subject, text, self.content)


    def send_resetpassword_email(self):
        subject   = settings.EMAIL_USER_RESET_SUBJECT.format(**self.content)
        text      = settings.EMAIL_USER_RESET_BODY.format(**self.content)
        return self.send_email("frontend/user_reset_password.html", subject, text, self.content)
