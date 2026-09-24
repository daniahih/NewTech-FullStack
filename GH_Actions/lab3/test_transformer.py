"""Unit tests for the transformer module."""

import unittest
from transformer import normalize_email, format_name, calculate_age_group, transform_record


class TestNormalizeEmail(unittest.TestCase):
    def test_converts_to_lowercase(self):
        self.assertEqual(normalize_email("USER@EXAMPLE.COM"), "user@example.com")

    def test_strips_whitespace(self):
        self.assertEqual(normalize_email("  user@example.com  "), "user@example.com")

    def test_mixed_case_with_spaces(self):
        self.assertEqual(normalize_email("  Alice@Domain.ORG  "), "alice@domain.org")

    def test_already_normalized(self):
        self.assertEqual(normalize_email("user@example.com"), "user@example.com")

    def test_non_string_raises_type_error(self):
        with self.assertRaises(TypeError):
            normalize_email(123)
        with self.assertRaises(TypeError):
            normalize_email(None)


class TestFormatName(unittest.TestCase):
    def test_title_cases_lowercase(self):
        self.assertEqual(format_name("john doe"), "John Doe")

    def test_strips_surrounding_whitespace(self):
        self.assertEqual(format_name("  jane  "), "Jane")

    def test_already_title_cased(self):
        self.assertEqual(format_name("John Doe"), "John Doe")

    def test_all_caps_converted(self):
        self.assertEqual(format_name("ALICE SMITH"), "Alice Smith")

    def test_non_string_raises_type_error(self):
        with self.assertRaises(TypeError):
            format_name(42)
        with self.assertRaises(TypeError):
            format_name(None)


class TestCalculateAgeGroup(unittest.TestCase):
    def test_minor_boundaries(self):
        self.assertEqual(calculate_age_group(0), "minor")
        self.assertEqual(calculate_age_group(10), "minor")
        self.assertEqual(calculate_age_group(17), "minor")

    def test_young_adult_boundaries(self):
        self.assertEqual(calculate_age_group(18), "young_adult")
        self.assertEqual(calculate_age_group(25), "young_adult")
        self.assertEqual(calculate_age_group(29), "young_adult")

    def test_adult_boundaries(self):
        self.assertEqual(calculate_age_group(30), "adult")
        self.assertEqual(calculate_age_group(45), "adult")
        self.assertEqual(calculate_age_group(59), "adult")

    def test_senior_boundaries(self):
        self.assertEqual(calculate_age_group(60), "senior")
        self.assertEqual(calculate_age_group(80), "senior")
        self.assertEqual(calculate_age_group(150), "senior")

    def test_negative_age_raises(self):
        with self.assertRaises(ValueError):
            calculate_age_group(-1)

    def test_string_raises_value_error(self):
        with self.assertRaises(ValueError):
            calculate_age_group("25")

    def test_float_raises_value_error(self):
        with self.assertRaises(ValueError):
            calculate_age_group(25.5)

    def test_boolean_raises_value_error(self):
        # True == 1 in Python but should not be treated as a valid age
        with self.assertRaises(ValueError):
            calculate_age_group(True)


class TestTransformRecord(unittest.TestCase):
    def test_full_transform(self):
        record = {"email": "USER@EXAMPLE.COM", "name": "john doe", "age": 25}
        result = transform_record(record)
        self.assertEqual(result["email"], "user@example.com")
        self.assertEqual(result["name"], "John Doe")
        self.assertEqual(result["age_group"], "young_adult")

    def test_original_dict_not_mutated(self):
        record = {"email": "USER@EXAMPLE.COM", "age": 25}
        transform_record(record)
        self.assertEqual(record["email"], "USER@EXAMPLE.COM")
        self.assertNotIn("age_group", record)

    def test_missing_fields_skipped_gracefully(self):
        record = {"age": 65}
        result = transform_record(record)
        self.assertEqual(result["age_group"], "senior")
        self.assertNotIn("email", result)
        self.assertNotIn("name", result)

    def test_extra_fields_preserved(self):
        record = {"email": "a@b.com", "score": 99}
        result = transform_record(record)
        self.assertEqual(result["score"], 99)

    def test_age_group_added_alongside_age(self):
        record = {"age": 35}
        result = transform_record(record)
        self.assertIn("age", result)
        self.assertIn("age_group", result)
        self.assertEqual(result["age_group"], "adult")


if __name__ == "__main__":
    unittest.main()
