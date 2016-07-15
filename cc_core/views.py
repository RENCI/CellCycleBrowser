from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
    template = loader.get_template('cc_core/index.html')
    context = {
    'text_to_display': "Hello, world. You're at the Cell Cycle Browser index page.",
    }
    return HttpResponse(template.render(context, request))
