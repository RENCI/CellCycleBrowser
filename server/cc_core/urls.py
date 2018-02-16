from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^guest/(?P<session>[A-z0-9_.]+)$', views.index, name='index'),
    url(r'^add_profile/login/$', auth_views.login, {'template_name': 'cc_core/login.html'},
        name='login'),
    url(r'^delete_profile/login/$', auth_views.login, {'template_name': 'cc_core/login.html'},
        name='login'),
    url(r'^add_user_workspace/$', views.add_user_workspace, name='add_user_workspace'),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
    url(r'^parameters/(?P<filename>[A-z0-9_.]+)$', views.extract_parameters,
        name='extract_parameters'),
    url(r'^get_profile_list/$',views.get_profile_list, name='get_profile_list'),
    url(r'^get_profile/$',views.get_profile, name='get_profile'),
    url(r'^send_parameter/$',views.send_parameter, name='send_parameter'),
    url(r'^runmodel/(?P<filename>[A-z0-9_.]+)$', views.run_model, name='run_model'),
    url(r'^check_task_status/$', views.check_task_status, name='check_task_status'),
    url(r'^get_model_result/(?P<filename>[A-z0-9_.]+)$', views.get_model_result,
        name="get_model_result"),
    url(r'^add_or_delete_a_profile_request/$', views.add_or_delete_profile_request, name='add_or_delete_profile_request'),
    url(r'^add_profile_to_server/$', views.add_profile_to_server, name='add_profile_to_server'),
    url(r'^delete_profile_from_server/$', views.delete_profile_from_server,
        name='delete_profile_from_server'),
    url(r'^about/$', views.about, name='about'),
    url(r'^help/$', views.help, name='help'),
    url(r'^cell_data_meta/(?P<filename>[A-z0-9_.]+)/$', views.cell_data_meta, name='cell_data_meta'),
    url(r'^download/(?P<filename>[A-z0-9_.]+)/$', views.download, name='download'),
    url(r'^create_sbml_model/$', views.create_sbml_model, name='create_sbml_model'),
    url(r'^delete_sbml_model/(?P<filename>[A-z0-9_.]+)/$', views.delete_sbml_model, name='delete_sbml_model'),
    url(r'^delete_sbml_model/(?P<filename>[A-z0-9_.]+)/(?P<sess_id>[A-z0-9_.]+)$', views.delete_sbml_model, name='delete_sbml_model'),
    url(r'^terminate_model_run/$', views.terminate_model_run, name="terminate_model_run"),
    url(r'^get_dataset_list/$', views.get_dataset_list, name="get_dataset_list"),
    url(r'^get_model_list/$', views.get_model_list, name="get_model_list"),
    url(r'^get_dataset/(?P<id>[A-z0-9_.]+)$', views.get_dataset, name="get_dataset"),
    url(r'^get_model/(?P<id>[A-z0-9_.]+)$', views.get_model, name="get_model"),
]
