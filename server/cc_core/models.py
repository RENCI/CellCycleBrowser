from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres.fields import HStoreField


# Create your models here.
class CellMetadata(models.Model):
    cell_filename = models.CharField(max_length=100)
    metadata_dict = HStoreField(default={})
