{{/*
Return the full name of the chart
*/}}
{{- define "maintenance-page.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}
