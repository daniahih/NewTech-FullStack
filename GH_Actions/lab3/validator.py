"""Data validation functions for the data pipeline."""


def validate_email(email: str) -> bool:
    """Return True if email is a valid format (contains @ and a dot in the domain)."""
    if not isinstance(email, str):
        return False
    parts = email.strip().split("@")
    if len(parts) != 2:
        return False
    local, domain = parts
    return bool(local) and "." in domain and len(domain) > 2


def validate_age(age) -> bool:
    """Return True if age is an integer between 0 and 150 (inclusive)."""
    if not isinstance(age, int) or isinstance(age, bool):
        return False
    return 0 <= age <= 150


def validate_username(username: str) -> bool:
    """Return True if username is 3–20 alphanumeric characters (underscores allowed)."""
    if not isinstance(username, str):
        return False
    if not (3 <= len(username) <= 20):
        return False
    return all(c.isalnum() or c == "_" for c in username)


def validate_record(record: dict) -> tuple:
    """Validate a user record dict.

    Returns:
        (is_valid, errors) where errors is a list of string descriptions.
    """
    errors = []
    if "email" not in record or not validate_email(record.get("email", "")):
        errors.append("invalid email")
    if "age" not in record or not validate_age(record.get("age")):
        errors.append("invalid age")
    if "username" not in record or not validate_username(record.get("username", "")):
        errors.append("invalid username")
    return (len(errors) == 0, errors)
