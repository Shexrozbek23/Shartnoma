from django.contrib import admin
from .models import District,Region,Oferta_detail,Oferta,product_type,type_service,inspection_general
# Register your models here.
admin.site.register(District)
admin.site.register(Region)
admin.site.register(Oferta_detail)
admin.site.register(Oferta)
admin.site.register(product_type)
admin.site.register(type_service)
admin.site.register(inspection_general)

