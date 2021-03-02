from .views import ProjectCreate, ProjectDelete, ProjectUpdate, CollectionCreate, CollectionDelete, \
    CollectionUpdate, DocumentUpload, DocumentDelete, DocumentUpdate, RetrieveUserData
from django.urls import path
urlpatterns = [
    path('project/create/', ProjectCreate.as_view(), name="create_project"),
path('project/delete/', ProjectDelete.as_view(), name="delete_project"),
path('project/update/', ProjectUpdate.as_view(), name="update_project"),
path('collection/create/', CollectionCreate.as_view(), name="create_collection"),
path('collection/delete/',CollectionDelete.as_view(), name="delete_collection"),
path('collection/update/', CollectionUpdate.as_view(), name="update_collection"),
path('document/upload/', DocumentUpload.as_view(), name="upload_document"),
path('document/delete/',DocumentDelete.as_view(), name="delete_document"),
path('document/update/', DocumentUpdate.as_view(), name="update_document"),
path('retrieve_userdata/<email>', RetrieveUserData.as_view(), name="retrieve_userdata"),


    ]
