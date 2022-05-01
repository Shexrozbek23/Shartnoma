from django.db import models

#Region model
class Region(models.Model):
    name_ru = models.CharField(max_length=512, verbose_name='Название регион')
    name_en = models.CharField(max_length=512, verbose_name='Name of region')
    name_uz = models.CharField(max_length=512, verbose_name='Viloyat nomi', null=True)
    coefficient = models.DecimalField(max_digits=20, decimal_places=4, null=True)
    limit = models.DecimalField(max_digits=20, decimal_places=4, null=True)
    def __str__(self):
        return self.name_ru
    class Meta:
        verbose_name_plural = 'Regions'
        db_table = 'region'

#District model
class District(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE, null=True, related_name='districts',
                               verbose_name='Область')
    name_ru = models.CharField(max_length=50, verbose_name='Название на русском')
    name_en = models.CharField(max_length=50, verbose_name='Название на английском')
    name_local = models.CharField(max_length=50, verbose_name='Местное название')
    code = models.CharField(max_length=3, unique=True, null=True, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name_ru
    class Meta:
        verbose_name = 'District'
        verbose_name_plural = 'Districts'
        db_table = 'district'

# type of serveice model
class type_service(models.Model):
    type=models.CharField(max_length=500)
    value=models.FloatField()
    added_at = models.DateTimeField(auto_now_add=True, editable=False, verbose_name='Добавлено в')
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    def __str__(self):
        return self.type

#type of crop model
class product_type(models.Model):    
    type=models.CharField(max_length=500)
    added_at = models.DateTimeField(auto_now_add=True, editable=False, verbose_name='Добавлено в')
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    def __str__(self):
        return self.type

#rector model
class inspection_general(models.Model):
    name=models.CharField(max_length=500,default='')
    added_at = models.DateTimeField(auto_now_add=True, editable=False, verbose_name='Добавлено в')
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    def __str__(self):
        return self.name

#Personal data model about oferta(adress,x_r.bank_card,inn,phone_nomer)
class Oferta_detail(models.Model):
    adress=models.CharField(max_length=100,verbose_name='Manzil')
    x_r=models.CharField(max_length=90,verbose_name='X/R')
    sh_x=models.CharField(max_length=90,verbose_name='Sh.X')
    bank=models.CharField(max_length=1000,verbose_name='Toshkent shaxar Markaziybank')
    mfo=models.CharField(max_length=50,verbose_name='MFO')
    oked=models.CharField(max_length=500,verbose_name='OKED')
    inn=models.CharField(max_length=15,verbose_name='INN')
    phone_number=models.CharField(max_length=9,verbose_name='Telefon')

#Oferta model
class Oferta(models.Model):
    region = models.ForeignKey(Region, on_delete=models.DO_NOTHING, verbose_name='Код региона заявителя')
    district = models.ForeignKey(District, on_delete=models.DO_NOTHING, verbose_name='Код дистрикт заявителя')
    code_number= models.CharField(max_length=18, verbose_name='Номер Оферта', unique=True, null=True,blank=True)
    given_date = models.DateField(auto_now_add=True, verbose_name='Дата выдачи')
    service_type = models.ForeignKey(type_service,on_delete=models.DO_NOTHING,related_name='service_type',verbose_name='Service Type',default=0)
    cadastre_number=models.IntegerField()
    product_type=models.ForeignKey(product_type,on_delete=models.DO_NOTHING,related_name='product_type',verbose_name='product_type',default=0)
    square_of_services = models.FloatField(verbose_name='Количество',default=0)
    payment_amount = models.DecimalField(verbose_name='Сумма платежа', max_digits=15, decimal_places=2,blank=True)
    paid_amount = models.DecimalField(verbose_name='Оплаченное количество', max_digits=15, decimal_places=2,default=0)
    applicant_organization = models.CharField(verbose_name='Организация', max_length=128, null=True)
    applicant_tin = models.CharField(verbose_name='ИНН/ПИНФЛ заявителя', max_length=15, null=True)
    applicant_fullname = models.CharField(verbose_name='ФИО заявителя', max_length=60, null=True)
    applicant_phone = models.CharField(verbose_name='Телефонный номер', max_length=9, null=True)
    general_inspection =  models.ForeignKey(inspection_general, on_delete=models.DO_NOTHING, verbose_name='Директор')
    added_at = models.DateTimeField(auto_now_add=True, editable=False, verbose_name='Добавлено в')
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    def __str__(self):
        return self.applicant_fullname