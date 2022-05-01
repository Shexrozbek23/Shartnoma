import pandas as pd


from django.core.management.base import BaseCommand
from django.utils import timezone

from contract_app.models import Region, District


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        time = timezone.now().strftime('%X')
        self.stdout.write("It's now %s" % time)
        col_names = ('pk', 'name_ru', 'name_en', 'name_uz', 'coefficient')
        regions = pd.read_csv("static/regions.csv", sep=",", names=col_names, header=None)
        for index, region in regions.iterrows():
            _, is_new = Region.objects.get_or_create(
                pk=region.pk,
                name_ru=region.name_ru,
                name_en=region.name_en,
                name_uz=region.name_uz,
                coefficient=region.coefficient
            )
            if is_new:
                print(f'{region.name_en} has been added successfully')
            else:
                print(f'{region.name_en} could not be added, any error occurred or it is already exist!!!!!!!!!!!')
        col_names = ('pk', 'name_ru', 'name_en', 'name_uz', 'unknown', 'date', 'region_id')
        districts = pd.read_csv("static/districts.csv", sep=",", names=col_names, header=None)
        for index, district in districts.iterrows():
            db_district, is_new = District.objects.get_or_create(
                pk=district.pk,
                region_id=district.region_id,
                name_ru=district.name_ru,
                name_en=district.name_en,
                name_local=district.name_uz
            )
            if is_new:
                print(f'{db_district.name_en} has been added successfully')
            else:
                print(f'{db_district.name_en} could not be added, any error occurred or it is already exist!!!!!!!!!!!')