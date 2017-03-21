from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^add_profile/login/$', auth_views.login, {'template_name': 'cc_core/login.html'},
        name='login'),
url(r'^delete_profile/login/$', auth_views.login, {'template_name': 'cc_core/login.html'},
        name='login'),
    url(r'^logout/$', auth_views.logout, {'next_page': '/'}, name='logout'),
    url(r'^data/config/(?P<filename>[A-z0-9_.]+)$', views.serve_config_data,
        name='serve_config_data'),
    url(r'^parameters/(?P<filename>[A-z0-9_.]+)$', views.extract_parameters,
        name='extract_parameters'),
    url(r'^get_profile_list/$',views.get_profile_list, name='get_profile_list'),
    url(r'^get_profile/$',views.get_profile, name='get_profile'),
    url(r'^send_parameter/$',views.send_parameter, name='send_parameter'),
    url(r'^runmodel/(?P<filename>[A-z0-9_.]+)$', views.run_model, name='run_model'),
    url(r'^check_task_status/$', views.check_task_status, name='check_task_status'),
    url(r'^get_model_result/(?P<filename>[A-z0-9_.]+)$', views.get_model_result,
        name="get_model_result"),
    url(r'^add_or_delete_profile_request/$', views.add_or_delete_profile_request, name='add_or_delete_profile_request'),
    url(r'^add_profile_to_server/$', views.add_profile_to_server, name='add_profile_to_server'),
    url(r'^delete_profile_from_server/$', views.delete_profile_from_server,
        name='delete_profile_from_server'),
    url(r'^terminate_model_run/$', views.terminate_model_run, name="terminate_model_run"),
]
