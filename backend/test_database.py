from database import create_database, add_discovery, get_discoveries_by_username


def sample_discovery(username):
    return {
        "username": username,
        "common_name": "Poison Ivy",
        "scientific_name": "Toxicodendron radicans",
        "description": "A plant that can cause an itchy rash.",
        "region_or_origin": "North America",
        "fun_fact": "It can grow as a vine, shrub, or ground cover.",
        "hazard_warning": "Do not touch. It can cause an allergic skin reaction."
    }


def test_database_creates():
    create_database()
    assert True


def test_save_discovery_for_username():
    create_database()
    new_id = add_discovery(sample_discovery("nasir"))
    assert new_id is not None


def test_get_discoveries_by_username():
    create_database()
    add_discovery(sample_discovery("nasir"))
    discoveries = get_discoveries_by_username("nasir")

    assert len(discoveries) > 0
    assert discoveries[0]["username"] == "nasir"
    assert discoveries[0]["common_name"] == "Poison Ivy"
