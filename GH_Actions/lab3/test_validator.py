"""Unit tests for the validator module."""

import unittest
from validator import validate_email, validate_age, validate_username, validate_record


class TestValidateEmail(unittest.TestCase):
    def test_valid_email(self):
        self.assertTrue(validate_email("user@example.com"))
        self.assertTrue(validate_email("name.surname@domain.org"))
        self.assertTrue(validate_email("test+tag@mail.io"))

    def test_missing_at_sign(self):
        self.assertFalse(validate_email("notanemail.com"))

    def test_missing_domain(self):
        self.assertFalse(validate_email("user@"))

    def test_missing_dot_in_domain(self):
        self.assertFalse(validate_email("user@nodot"))

    def test_non_string_input(self):
        self.assertFalse(validate_email(123))
        self.assertFalse(validate_email(None))

    def test_empty_string(self):
        self.assertFalse(validate_email(""))

    def test_multiple_at_signs(self):
        self.assertFalse(validate_email("a@b@c.com"))


class TestValidateAge(unittest.TestCase):
    def test_valid_ages(self):
        self.assertTrue(validate_age(0))
        self.assertTrue(validate_age(25))
        self.assertTrue(validate_age(150))

    def test_negative_age(self):
        self.assertFalse(validate_age(-1))

    def test_over_limit(self):
        self.assertFalse(validate_age(151))

    def test_float_rejected(self):
        self.assertFalse(validate_age(25.5))

    def test_string_rejected(self):
        self.assertFalse(validate_age("25"))

    def test_boolean_rejected(self):
        # True == 1 in Python, but booleans should not be valid ages
        self.assertFalse(validate_age(True))
        self.assertFalse(validate_age(False))


class TestValidateUsername(unittest.TestCase):
    def test_valid_usernames(self):
        self.assertTrue(validate_username("john_doe"))
        self.assertTrue(validate_username("abc"))
        self.assertTrue(validate_username("user123"))
        self.assertTrue(validate_username("a" * 20))

    def test_too_short(self):
        self.assertFalse(validate_username("ab"))

    def test_too_long(self):
        self.assertFalse(validate_username("a" * 21))

    def test_hyphen_not_allowed(self):
        self.assertFalse(validate_username("user-name"))

    def test_space_not_allowed(self):
        self.assertFalse(validate_username("user name"))

    def test_non_string(self):
        self.assertFalse(validate_username(42))
        self.assertFalse(validate_username(None))


class TestValidateRecord(unittest.TestCase):
    def test_valid_record(self):
        record = {"email": "user@example.com", "age": 30, "username": "john_doe"}
        is_valid, errors = validate_record(record)
        self.assertTrue(is_valid)
        self.assertEqual(errors, [])

    def test_invalid_email(self):
        record = {"email": "bademail", "age": 30, "username": "john_doe"}
        is_valid, errors = validate_record(record)
        self.assertFalse(is_valid)
        self.assertIn("invalid email", errors)

    def test_invalid_age(self):
        record = {"email": "user@example.com", "age": -5, "username": "john_doe"}
        is_valid, errors = validate_record(record)
        self.assertFalse(is_valid)
        self.assertIn("invalid age", errors)

    def test_all_fields_invalid(self):
        record = {"email": "bad", "age": -5, "username": "x"}
        is_valid, errors = validate_record(record)
        self.assertFalse(is_valid)
        self.assertEqual(len(errors), 3)

    def test_empty_record(self):
        is_valid, errors = validate_record({})
        self.assertFalse(is_valid)
        self.assertEqual(len(errors), 3)

    def test_extra_fields_ignored(self):
        record = {
            "email": "user@example.com",
            "age": 30,
            "username": "john_doe",
            "extra": "ignored",
        }
        is_valid, errors = validate_record(record)
        self.assertTrue(is_valid)


if __name__ == "__main__":
    unittest.main()
