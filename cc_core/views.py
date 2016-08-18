import csv
import json

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

def get_profile_list(request):
    """
    It is invoked by an AJAX call, so it returns json object that holds data set list
    """
    return_object = {}
    profile_list = []
    for i in range(1, 4):
        dataset_obj = {}
        dataset_obj['name'] = 'Cell Cycle Profile ' + str(i)
        dataset_obj['description'] = 'Data and models ' + str(i)
        dataset_obj['value'] = 'data/PCNA_53BP1_transpose.csv'
        profile_list.append(dataset_obj)
    return_object['profilelist'] = profile_list
    jsondump = json.dumps(return_object)
    return HttpResponse(
        jsondump,
        content_type="application/json"
    )
