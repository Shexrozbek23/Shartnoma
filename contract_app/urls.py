from contract_app import views
from django.urls import path


urlpatterns = [
    path('contraclist',views.Agrement.as_view()),
    path('contract_pdf',views.Contract_filter.as_view()),
]