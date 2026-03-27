CREATE DATABASE homemanagement;
Use homemanagement;
desc homes;

ALTER TABLE homes   modify column barcode blob;
create table homemanagement.homes
(
    db_id             bigint auto_increment
        primary key,
    address_line1     varchar(255)  null,
    address_line2     varchar(255)  null,
    assessorid        varchar(255)  null,
    barcode           mediumblob    null,
    bathrooms         double        null,
    bedrooms          int           null,
    city              varchar(255)  null,
    county            varchar(255)  null,
    county_fips       varchar(255)  null,
    architecture_type varchar(255)  null,
    cooling           bit           null,
    cooling_type      varchar(255)  null,
    floor_count       int           null,
    foundation_type   varchar(255)  null,
    garage            bit           null,
    garage_type       varchar(255)  null,
    heating           bit           null,
    heating_type      varchar(255)  null,
    formatted_address varchar(255)  null,
    id                varchar(255)  null,
    last_sale_date    varchar(255)  null,
    latitude          double        null,
    legal_description varchar(1000) null,
    longitude         double        null,
    lot_size          int           null,
    owner_occupied    bit           null,
    property_type     varchar(255)  null,
    square_footage    int           null,
    state             varchar(255)  null,
    state_fips        varchar(255)  null,
    subdivision       varchar(255)  null,
    year_built        int           null,
    zip_code          varchar(255)  null
);

select * from homemanagement.homes;

select *
from users;

desc homes;
ALTER TABLE homes
    MODIFY barcode BLOB;
commit;

-- Add a relation from homes to users using email as the FK
-- users.email is varchar(255) (NOT NULL) according to the introspected schema
ALTER TABLE homemanagement.homes
    ADD COLUMN user_email VARCHAR(255) NULL;

ALTER TABLE homemanagement.homes
    ADD INDEX idx_homes_user_email (user_email);

ALTER TABLE homemanagement.homes
    ADD CONSTRAINT fk_homes_user_email
        FOREIGN KEY (user_email)
            REFERENCES homemanagement.users(email)
            ON DELETE SET NULL
            ON UPDATE CASCADE;

commit;