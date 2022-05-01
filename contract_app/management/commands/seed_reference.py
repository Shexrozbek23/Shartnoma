from decimal import Decimal

from django.core.management import BaseCommand
from django.utils import timezone
import pandas as pd

from coredata.models import Reference, ItemType


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        time = timezone.now().strftime('%X')
        self.stdout.write("It's now %s" % time)
        col_names = ('code', 'val',)
        items = pd.read_csv("static/PHOSPHORUS.csv", sep=";", names=col_names, header=None)
        for index, item in items.iterrows():
            Reference.objects.create(
                code=item.code,
                val=Decimal(item.val),
                type=ItemType.PHOSPHORUS_COEFFICIENT
            )
        col_names = ('code', 'val')
        items = pd.read_csv("static/POTASSIUM.csv", sep=";", names=col_names, header=None)
        for index, item in items.iterrows():
             Reference.objects.create(
                code=item.code,
                val=Decimal(item.val),
                type=ItemType.POTASSIUM_COEFFICIENT
            )
        col_names = ('name_ru', 'name_uz', 'nitrogen_val', 'phosphorus_val', 'potassium_val')
        items = pd.read_csv("static/EXPENSES.csv", sep=";", names=col_names, header=None)
        for index, item in items.iterrows():
            Reference.objects.create(
                name_ru=item.name_ru,
                name_uz=item.name_uz,
                nitrogen_val=Decimal(item.nitrogen_val),
                phosphorus_val=Decimal(item.phosphorus_val),
                potassium_val=Decimal(item.potassium_val),
                type=ItemType.EXPENSE,
                code=f"e{index+1}"
            )