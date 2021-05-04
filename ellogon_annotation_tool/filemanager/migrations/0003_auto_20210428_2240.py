# Generated by Django 3.1.7 on 2021-04-28 19:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('filemanager', '0002_handler'),
    ]

    operations = [
        migrations.AlterField(
            model_name='handler',
            name='function_name',
            field=models.CharField(default='UTF-8', max_length=128, verbose_name='FunctionName'),
        ),
        migrations.AlterField(
            model_name='handler',
            name='name',
            field=models.CharField(default='UTF-8', max_length=128, unique=True, verbose_name='Name'),
        ),
    ]
