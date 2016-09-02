from django.conf.urls import url

from cc_core import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^data/(?P<filename>[A-z0-9_.]+)$', views.serve_data, name='serve_data'),
    url(r'^data/config/(?P<filename>[A-z0-9_.]+)$', views.serve_config_data, name='serve_config_data'),
    url(r'^phases/(?P<filename>[A-z0-9_.]+)$', views.extract_phases, name='extract_phases'),
    url(r'^species/(?P<filename>[A-z0-9_.]+)$', views.extract_species, name='extract_species'),
    url(r'^parameters/(?P<filename>[A-z0-9_.]+)$', views.extract_parameters, name='extract_parameters'),
    url(r'^get_profile_list/$',views.get_profile_list, name='get_profile_list'),
    url(r'^runmodel/(?P<filename>[A-z0-9_.]+)$', views.run_model, name='run_model'),
]
