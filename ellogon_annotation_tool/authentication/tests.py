from django.test import TestCase
from .send_email import EmailAlert
from django.core.mail import EmailMultiAlternatives
from django.core.mail import send_mail
from django.core import mail
from django.conf import settings
from django.test.utils import override_settings

@override_settings(EMAIL_BACKEND='django.core.mail.backends.smtp.EmailBackend')
class EmailTestCase(TestCase):
    def setUp(self):
        self.recipients = [
            "petasis@iit.demokritos.gr",
            "petasisg@yahoo.gr",
            "antogramatzis@iit.demokritos.gr"
        ]

    def test_email_send(self):
        print("HOST:", settings.EMAIL_HOST,    ", PORT:", settings.EMAIL_PORT)
        print("TLS:",  settings.EMAIL_USE_TLS, ", EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
        msg = EmailMultiAlternatives(subject="This is a test e-mail from Django!",
            body="E-mail body!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=self.recipients)
        connection = msg.get_connection()
        print('connection:', connection)
        status = msg.send(fail_silently=False)
        print("status:", status)
