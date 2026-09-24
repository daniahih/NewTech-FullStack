"""Unit tests for the reporter module."""

import unittest
from reporter import count_by_age_group, get_invalid_records, generate_summary

SAMPLE_RECORDS = [
    {"email": "alice@example.com", "age": 25, "username": "alice_w"},   # valid, young_adult
    {"email": "bob@example.com",   "age": 35, "username": "bob_42"},    # valid, adult
    {"email": "carol@example.com", "age": 65, "username": "carol_s"},   # valid, senior
    {"email": "dave@example.com",  "age": 15, "username": "dave_d"},    # valid, minor
    {"email": "bademail",          "age": -1, "username": "x"},         # invalid (all fields)
]


class TestCountByAgeGroup(unittest.TestCase):
    def test_correct_group_counts(self):
        counts = count_by_age_group(SAMPLE_RECORDS)
        self.assertEqual(counts["minor"], 1)
        self.assertEqual(counts["young_adult"], 1)
        self.assertEqual(counts["adult"], 1)
        self.assertEqual(counts["senior"], 1)

    def test_empty_list_returns_zeros(self):
        counts = count_by_age_group([])
        self.assertEqual(sum(counts.values()), 0)

    def test_skips_negative_age(self):
        records = [{"age": -1}, {"age": 30}]
        counts = count_by_age_group(records)
        self.assertEqual(counts["adult"], 1)
        self.assertEqual(sum(counts.values()), 1)

    def test_skips_string_age(self):
        records = [{"age": "twenty"}, {"age": 20}]
        counts = count_by_age_group(records)
        self.assertEqual(counts["young_adult"], 1)
        self.assertEqual(sum(counts.values()), 1)

    def test_skips_missing_age(self):
        records = [{"username": "noage"}, {"age": 40}]
        counts = count_by_age_group(records)
        self.assertEqual(counts["adult"], 1)
        self.assertEqual(sum(counts.values()), 1)

    def test_all_age_groups_present_as_keys(self):
        counts = count_by_age_group([])
        self.assertIn("minor", counts)
        self.assertIn("young_adult", counts)
        self.assertIn("adult", counts)
        self.assertIn("senior", counts)


class TestGetInvalidRecords(unittest.TestCase):
    def test_detects_one_invalid_record(self):
        invalid = get_invalid_records(SAMPLE_RECORDS)
        self.assertEqual(len(invalid), 1)

    def test_invalid_record_has_correct_index(self):
        invalid = get_invalid_records(SAMPLE_RECORDS)
        self.assertEqual(invalid[0]["index"], 4)

    def test_invalid_record_contains_errors(self):
        invalid = get_invalid_records(SAMPLE_RECORDS)
        self.assertIn("errors", invalid[0])
        self.assertTrue(len(invalid[0]["errors"]) > 0)

    def test_all_valid_returns_empty_list(self):
        records = [
            {"email": "a@b.com", "age": 20, "username": "alice"},
            {"email": "c@d.com", "age": 40, "username": "bob_s"},
        ]
        self.assertEqual(get_invalid_records(records), [])

    def test_all_invalid_returns_all(self):
        records = [{}, {}]
        invalid = get_invalid_records(records)
        self.assertEqual(len(invalid), 2)

    def test_original_record_stored_in_result(self):
        records = [{"email": "bad"}]
        invalid = get_invalid_records(records)
        self.assertEqual(invalid[0]["record"], {"email": "bad"})


class TestGenerateSummary(unittest.TestCase):
    def test_total_count(self):
        summary = generate_summary(SAMPLE_RECORDS)
        self.assertEqual(summary["total"], 5)

    def test_valid_and_invalid_counts(self):
        summary = generate_summary(SAMPLE_RECORDS)
        self.assertEqual(summary["valid"], 4)
        self.assertEqual(summary["invalid"], 1)

    def test_valid_percentage(self):
        summary = generate_summary(SAMPLE_RECORDS)
        self.assertEqual(summary["valid_percentage"], 80.0)

    def test_valid_percentage_rounds_correctly(self):
        records = [
            {"email": "a@b.com", "age": 20, "username": "alice"},
            {"email": "bad"},
            {"email": "bad"},
        ]
        summary = generate_summary(records)
        self.assertEqual(summary["valid_percentage"], 33.3)

    def test_empty_list_returns_zero_percentage(self):
        summary = generate_summary([])
        self.assertEqual(summary["total"], 0)
        self.assertEqual(summary["valid_percentage"], 0)

    def test_age_groups_key_present(self):
        summary = generate_summary(SAMPLE_RECORDS)
        self.assertIn("age_groups", summary)

    def test_age_groups_content(self):
        summary = generate_summary(SAMPLE_RECORDS)
        self.assertEqual(summary["age_groups"]["minor"], 1)
        self.assertEqual(summary["age_groups"]["young_adult"], 1)
        self.assertEqual(summary["age_groups"]["adult"], 1)
        self.assertEqual(summary["age_groups"]["senior"], 1)

    def test_valid_plus_invalid_equals_total(self):
        summary = generate_summary(SAMPLE_RECORDS)
        self.assertEqual(summary["valid"] + summary["invalid"], summary["total"])


if __name__ == "__main__":
    unittest.main()
