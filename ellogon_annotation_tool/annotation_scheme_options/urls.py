from django.urls import path

from .views import GetLanguages, GetAnnotationTypes, GetAnnotationAttributes, GetAttributeAlternatives, GetValues, \
    GetAttributes, GetSchema

urlpatterns = [
path('get_languages/<type>', GetLanguages.as_view(), name="get_languages"),
path('get_types/<type>', GetAnnotationTypes.as_view(), name="get_types"),
path('get_attributes/<type>', GetAnnotationAttributes.as_view(), name="get_attributes"),
path('get_attribute_alternatives/<type>', GetAttributeAlternatives.as_view(), name="get_attribute_alternatives"),
path('get_values/<type>', GetValues.as_view(), name="get_values"),
path('get_coreference_attributes/<type>', GetAttributes.as_view(), name="get_coreference_attributes"),
path('get_schema/<type>', GetSchema.as_view(), name="get_schema")
]