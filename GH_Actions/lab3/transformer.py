"""Data transformation functions for the data pipeline."""


def normalize_email(email: str) -> str:
    """Lowercase and strip whitespace from an email address."""
    if not isinstance(email, str):
        raise TypeError("email must be a string")
    return email.strip().lower()


def format_name(name: str) -> str:
    """Title-case a name, stripping leading/trailing whitespace."""
    if not isinstance(name, str):
        raise TypeError("name must be a string")
    return name.strip().title()


def calculate_age_group(age: int) -> str:
    """Return an age-group label for the given age.

    Groups:
        minor       — under 18
        young_adult — 18 to 29
        adult       — 30 to 59
        senior      — 60 and above
    """
    if not isinstance(age, int) or isinstance(age, bool) or age < 0:
        raise ValueError("age must be a non-negative integer")
    if age < 18:
        return "minor"
    if age < 30:
        return "young_adult"
    if age < 60:
        return "adult"
    return "senior"


def transform_record(record: dict) -> dict:
    """Return a transformed copy of a user record.

    Applies:
        - normalize_email  → lowercased email
        - format_name      → title-cased name
        - calculate_age_group → adds 'age_group' key

    The original dict is never mutated.
    """
    transformed = dict(record)
    if "email" in transformed:
        transformed["email"] = normalize_email(transformed["email"])
    if "name" in transformed:
        transformed["name"] = format_name(transformed["name"])
    if "age" in transformed:
        transformed["age_group"] = calculate_age_group(transformed["age"])
    return transformed
