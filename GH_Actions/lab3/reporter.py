"""Report generation functions for the data pipeline."""

from transformer import calculate_age_group
from validator import validate_record


def count_by_age_group(records: list) -> dict:
    """Count records by age group.

    Skips records whose 'age' field is missing or invalid.
    Returns a dict with keys: minor, young_adult, adult, senior.
    """
    counts = {"minor": 0, "young_adult": 0, "adult": 0, "senior": 0}
    for record in records:
        age = record.get("age")
        if isinstance(age, int) and not isinstance(age, bool) and age >= 0:
            group = calculate_age_group(age)
            counts[group] += 1
    return counts


def get_invalid_records(records: list) -> list:
    """Return a list of dicts describing records that fail validation.

    Each entry has:
        index   — position in the original list
        record  — the original record dict
        errors  — list of validation error strings
    """
    invalid = []
    for i, record in enumerate(records):
        is_valid, errors = validate_record(record)
        if not is_valid:
            invalid.append({"index": i, "record": record, "errors": errors})
    return invalid


def generate_summary(records: list) -> dict:
    """Generate a summary report for a list of records.

    Returns:
        total            — total number of records
        valid            — number of valid records
        invalid          — number of invalid records
        valid_percentage — percentage of valid records (0 if list is empty)
        age_groups       — counts per age group (valid ages only)
    """
    total = len(records)
    invalid_list = get_invalid_records(records)
    valid_count = total - len(invalid_list)
    return {
        "total": total,
        "valid": valid_count,
        "invalid": len(invalid_list),
        "valid_percentage": round(valid_count / total * 100, 1) if total > 0 else 0,
        "age_groups": count_by_age_group(records),
    }
