import simplejwt as simplejwt
from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import ResetPassword, ChangePassword
from .views import ObtainTokenPairView, \
        CustomUserCreate, \
        MainView, \
        LogoutAndBlacklistRefreshTokenForUserView, \
        ActivationView, \
        LoginView, \
        ManageProfileView  # ,TestView

urlpatterns = [
    path('user/create/',                   CustomUserCreate.as_view(),             name="user_create"),
    path('user/activate/<uidb64>/<token>', ActivationView.as_view(),               name='user_activate'),
    path('user/login/',                    LoginView.as_view(),                    name="user_login"),
    path('user/profile_manage/',           ManageProfileView.as_view(),            name='user_profile'),
    path('user/password_reset/',           ResetPassword.as_view(),                name='user_password_reset'),
    path('user/password_change/',          ChangePassword.as_view(),               name='user_password_change'),
    path('user/logout/',                   LogoutAndBlacklistRefreshTokenForUserView.as_view(), name='user_logout'),
    path('user/token/obtain/',             ObtainTokenPairView.as_view(),          name='user_token_obtain'),
    path('user/token/refresh/',            jwt_views.TokenRefreshView.as_view(),   name='user_token_refresh'),
    path('main/',                          MainView.as_view(),                     name='main'),
]
