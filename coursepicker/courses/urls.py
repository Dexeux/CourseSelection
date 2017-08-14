from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^courses', views.courses),
    url(r'^register', views.courses),
]