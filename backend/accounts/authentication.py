from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions
from django.conf import settings


def enforce_csrf(request):
    check = CSRFCheck()
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied("CSRF Failed: %s" % reason)


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        print("Authenticating request...")
        header = self.get_header(request)
        print(f"Header: {header}")

        if header is None:
            print("Header is None, checking cookies...")
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"]) or None
            print(f"Token from cookie: {raw_token}")
        else:
            print("Header is not None, extracting token...")
            raw_token = self.get_raw_token(header)
            print(f"Raw token from header: {raw_token}")

        if raw_token is None:
            print("No token found")
            return None

        print(f"Final raw token: {raw_token}")

        try:
            validated_token = self.get_validated_token(raw_token)
            print("Token validated successfully")
        except Exception as e:
            print(f"Token validation failed: {str(e)}")
            return None

        # try:
        #     enforce_csrf(request)
        #     print("CSRF check passed")
        # except Exception as e:
        #     print(f"CSRF check failed: {str(e)}")
        #     return None

        user = self.get_user(validated_token)
        print(f"Authenticated user: {user}")
        return user, validated_token
