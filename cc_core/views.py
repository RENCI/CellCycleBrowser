import csv

from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
    template = loader.get_template('cc_core/index.html')
    context = {
    'text_to_display': "This Cell Cycle Browser allows exploration and simulation of the human cell cycle.",
    }
    return HttpResponse(template.render(context, request))

def serve_data(request, filename, *args, **kwargs):
    fp = open('data/'+filename, 'rb')
    data = csv.reader(fp)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="'+filename+'"'
    writer = csv.writer(response)
    for row in data:
        writer.writerow(row)
    
    return response
