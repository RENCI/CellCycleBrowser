from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^data/(?P<filename>[A-z0-9_.]+)$', views.serve_data, name='serve_data'),
    url(r'^get_profile_list/$',views.get_profile_list, name='get_profile_list'),
]
