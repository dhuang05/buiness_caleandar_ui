export class LoginForm {
        userId!: string;
        email!: string;
        password!: string;
        newPassword!: string;
}

export class BusinessCalendarOwnership {
        calId!: string;
        version!: number;
        description!: string;
        calendarInst!: CalendarInst;
        ownerId!: string;
        status!: string;
        note!: string;
}

export class CalendarInst {
        calId!: string;
        desc!: string;
        timeZone!: string;
        businessHours!: BusinessHour[];
        holidayRules!: DayRule[];
}

export class BusinessHour {
        dayExpr!: string;
        desc!: string;
        overriding!: boolean;
        //HH!:mm!:ss
        businessHourFrom!: string;
        //HH!:mm!:ss
        businessHourTo!: string;
}

export class DayRule {
        dayRuleId!: string;
        desc!: string;
        expr!: string;
        effectiveDate!: Date | undefined;
        expiredDate!: Date | undefined;
}

export class AvailableTimeslot {
        calendarTimeslot!: Timeslot;
        requestTimeslot!: Timeslot;
}

export class Timeslot {
        start!: string;
        end!: string;
}

export class Calendar {
        year!: number;
        calId!: string;
        desc!: string;
        isLeapYear!: boolean;
        businessHours!: { [key: number]: DowBusinessHour; };
        overridingBusinessHours!: { [key: string]: OverridingBusinessHour; };
        daytimeSavingFrom!: string;
        daytimeSavingTo!: string;
        timeZoneId!: string;
        standardWorkingHoursOfDay!: number;
        holidays!: Holiday[];
        days!: Day[];
}

export class Day {
        date!: string;
        businessTimeFrom!: string;
        businessTimeTo!: string;
        dow!: number;
        isBusinessDay!: boolean;
        isDayLightSaving!: boolean;
        holiday!: Holiday;
        isOverridingWorkingHour!: boolean;
}

export class Holiday {
        ruleId!: string;
        name!: string;
        day!: string;
}

export class DowBusinessHour {
        dayOfWeek!: number;
        businessTimeFrom!: string;
        businessTimeTo!: string;
}


export class OverridingBusinessHour {
        day!: string;
        businessTimeFrom!: string;
        businessTimeTo!: string;
}

export class Element {
        error!: string;
        type!: string;
        text!: string;
}

export class UserInfo {
        user!: User;
        businessCalendarOwnerships!: BusinessCalendarOwnership[];
}

export class User {
        userId!: string;
        person!: Person;
        orgId!: string;
}

export class Person {
        personId!: string;
        contact!: Contact;
        title!: string;
        solute!: string;
        firstName!: string;
        lastName!: string;
}

export class Contact {
        contactId!: string;
        mailingAddress!: string;
        email!: string;
        primaryPhone!: string;
        secondaryPhone!: string;
        otherInfo!: string;
}

export class ApiError {
        status!: string;
        timestamp!: Date;
        code !: string;
        message !: string;
        subErrors !: string[];
}