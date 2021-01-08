/*
 * Copyright © 2014-2019 Capco. All rights reserved.
 * Capco Digital Framework.
 */


import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiError, BusinessCalendarOwnership, BusinessHour, CalendarInst, DayRule } from '../model/cal-model';
import { CalAdminService } from './services/cal_admin.service';
import { AuthService } from '../auth/services/auth.service';
import { Util } from '../common/util';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'cal-cal-admin',
  templateUrl: './cal-admin.component.html',
  styleUrls: [ './cal-admin.component.scss' ]
})
export class CalAdminComponent implements OnInit {
  message: string = '';
  businessCalendarOwnerships!: BusinessCalendarOwnership[] | undefined;
  NUM_DOW_MAP: Map<number, string> = new Map();
  DOW_NUM_MAP: Map<string, number>  = new Map();

  //
  selectedBusinessCalendarOwnership: BusinessCalendarOwnership | undefined;
  selectedCalendarInst: CalendarInst | undefined;
  //temp only
  selectedWeeklyBusinessHours: BusinessHour[] = [];
  selectedSpecialBusinessHours: BusinessHour[] = [];
  specialBusinessHourChunks: BusinessHour[][] = [];
  holidayChunks: DayRule[][] = [];
  isContentChanged: boolean = false;
  backupCalendarInst: CalendarInst | undefined;

  //
   edited: boolean = false;
  ruleNUmPerRow: number = 6;
  dialogRef: any;

  constructor(
    private router: Router,
    private calAdminService: CalAdminService,
    private authService: AuthService,
    private route: ActivatedRoute,
    public dialog: MatDialog){
  }

  ngOnInit() {
    this.businessCalendarOwnerships = undefined;
    if(this.authService.getUserInfo() == undefined) {
      this.router.navigate(['login']);
      return;
    }
    this.businessCalendarOwnerships = this.authService.getUserInfo().businessCalendarOwnerships;
    this.initialize();
  }
  
  fetchCalendarInstance(businessCalendarOwnership: BusinessCalendarOwnership) {
    let canLoadNew = true;
    if(this.isContentChanged) {
      this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '350px',
        height: '250px',
        data: "The calendar content has been edited, Are you sure to reload without persistence to backend?"
      });
  
      this.dialogRef.afterClosed().subscribe((result: boolean) => {
         if(result == true) {
          this.dialogRef.close();
          this.reload(businessCalendarOwnership);
         }
      });
    } else {
      this.reload(businessCalendarOwnership);
    }
  }

  private reload(businessCalendarOwnership: BusinessCalendarOwnership) {
    this.message = "";
    this.clearSelectd();
    this.calAdminService.fetchCalendarInst(businessCalendarOwnership.calId).subscribe(resp => {
      let json = JSON.stringify(resp);
      console.log("json: " + json);
      let error: ApiError = JSON.parse(json);
      if(error.status == null || error.status == undefined) {
        this.selectedCalendarInst = JSON.parse(json);
        this.selectedBusinessCalendarOwnership = businessCalendarOwnership;
        this.sortCalendar(this.selectedCalendarInst as CalendarInst);
        this.backupCalendarInst = Util.copy(this.selectedCalendarInst);
      } else {
        this.message = error.message;
      }
     });
  }

  sortCalendar(selectedCalendarInst: CalendarInst) {
    this.selectedCalendarInst = selectedCalendarInst;
    this.sortOpenHours(this.selectedCalendarInst as CalendarInst);
    this.sortHolidys(this.selectedCalendarInst as CalendarInst);
  }

  sortHolidys(selectedCalendarInst: CalendarInst) {
    if(selectedCalendarInst.holidayRules) {
      this.holidayChunks = this.chunks(selectedCalendarInst.holidayRules, this.ruleNUmPerRow) as DayRule[][];
    }
  }

  sortOpenHours(selectedCalendarInst: CalendarInst) {
    let weeklyBusinessHours: BusinessHour[] = [];
    let specialBusinessHours: BusinessHour[] = [];
    for (let [key, value] of this.NUM_DOW_MAP) {
      let businessHour = new BusinessHour();
      businessHour.desc = value;
      businessHour.dayExpr = value;
      weeklyBusinessHours.push(businessHour);
    }
    for(let businessHour of selectedCalendarInst.businessHours) {
      if(businessHour.overriding) {
        specialBusinessHours.push(businessHour);
      }else{
        weeklyBusinessHours[this.DOW_NUM_MAP.get(businessHour.dayExpr.toUpperCase()) as number] = businessHour;
      }
    }
    this.selectedWeeklyBusinessHours = weeklyBusinessHours;
    this.selectedSpecialBusinessHours = specialBusinessHours;

    if(this.selectedSpecialBusinessHours) {
      this.specialBusinessHourChunks = this.chunks(this.selectedSpecialBusinessHours, this.ruleNUmPerRow) as BusinessHour[][];
    }
  }

  

  private makeEmpty(dow: number): BusinessHour {
    let businessHour = new BusinessHour();
    return businessHour;
  }

  newCalendarInstance(e: Event) {
    console.log("new instance ");
  }

  deleteSpecialBusinessHour(businessHour: BusinessHour){
    if(this.selectedCalendarInst?.businessHours) {
      this.selectedCalendarInst?.businessHours.forEach( (item, index) => {
        if(item === businessHour) this.selectedCalendarInst?.businessHours.splice(index,1);
      });
    }
    this.sortOpenHours(this.selectedCalendarInst as CalendarInst);
    if(this.selectedSpecialBusinessHours) {
      this.specialBusinessHourChunks = this.chunks(this.selectedSpecialBusinessHours, this.ruleNUmPerRow) as BusinessHour[][];
    }
    this.isChanged();
  }

  addSpecialBusinessHour() {
    let businessHour = new BusinessHour();
    businessHour.overriding = true;
    this.selectedCalendarInst?.businessHours.push(businessHour);
    this.sortOpenHours(this.selectedCalendarInst as CalendarInst) ;
    this.isChanged();
  }

  deleteHolidayRule (holidayRule: DayRule){
    if(this.selectedCalendarInst?.holidayRules) {
      this.selectedCalendarInst?.holidayRules.forEach( (item, index) => {
        if(item === holidayRule) this.selectedCalendarInst?.holidayRules.splice(index,1);
      });
    }
    this.sortHolidys(this.selectedCalendarInst as CalendarInst) ;
    this.isChanged();
  }

  addHolidayRule() {
    let dayRule = new DayRule();
    this.selectedCalendarInst?.holidayRules.push(dayRule);
    this.sortHolidys(this.selectedCalendarInst as CalendarInst);
    this.isChanged();
  }

  clearSelectd(){
    this.selectedBusinessCalendarOwnership  = undefined;
    this.selectedCalendarInst = undefined;
    this.selectedWeeklyBusinessHours = [];
    this.selectedSpecialBusinessHours = [];
    this.holidayChunks = [];
    this.specialBusinessHourChunks = [];
    //
    
    this.isContentChanged  = false;
    this.backupCalendarInst = undefined;
  }

  resetPassword(e: Event) {
    if(this.authService.getUserInfo() != undefined) {
      this.router.dispose();
      this.router.navigate(['resetpassword']);
    }
  }
 
  chunks(arr:any[], n:number) : any[][]{
    let chunks: any[][] = [];
    for (let i = 0; i < arr.length; i += n) {
      chunks.push(arr.slice(i, i + n));
    }
    return chunks;
  }

  isChanged() {
    this.isContentChanged = true || Util.isEqual(this.backupCalendarInst, this.selectedCalendarInst);
  }

  saveCalednar(){
    let ownership: BusinessCalendarOwnership = Util.copy(this.selectedBusinessCalendarOwnership);
    ownership.calendarInst = this.selectedCalendarInst as CalendarInst;
    

    console.log( "After changed: " + JSON.stringify(this.selectedCalendarInst));
  }


  testCalednar(){
    
  }


  initialize() {
    this.NUM_DOW_MAP.set(0, "Monday");
    this.NUM_DOW_MAP.set(1, "Tuesday");
    this.NUM_DOW_MAP.set(2, "Wednesday");
    this.NUM_DOW_MAP.set(3, "Thursday");
    this.NUM_DOW_MAP.set(4, "Friday");
    this.NUM_DOW_MAP.set(5, "Saturday");
    this.NUM_DOW_MAP.set(6, "Sunday");
    //
    this.DOW_NUM_MAP.set("MONDAY", 0);
    this.DOW_NUM_MAP.set("TUESDAY", 1);
    this.DOW_NUM_MAP.set("WEDNESDAY", 2);
    this.DOW_NUM_MAP.set("THURSDAY", 3);
    this.DOW_NUM_MAP.set("FRIDAY", 4);
    this.DOW_NUM_MAP.set("SATURDAY", 5);
    this.DOW_NUM_MAP.set("SUNDAY", 6);
  } 


  timezones: string[] = ["America/Adak",
  "America/Anchorage",
  "America/Anguilla",
  "America/Antigua",
  "America/Araguaina",
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Catamarca",
  "America/Argentina/ComodRivadavia",
  "America/Argentina/Cordoba",
  "America/Argentina/Jujuy",
  "America/Argentina/La_Rioja",
  "America/Argentina/Mendoza",
  "America/Argentina/Rio_Gallegos",
  "America/Argentina/Salta",
  "America/Argentina/San_Juan",
  "America/Argentina/San_Luis",
  "America/Argentina/Tucuman",
  "America/Argentina/Ushuaia",
  "America/Aruba",
  "America/Asuncion",
  "America/Atikokan",
  "America/Atka",
  "America/Bahia",
  "America/Bahia_Banderas",
  "America/Barbados",
  "America/Belem",
  "America/Belize",
  "America/Blanc-Sablon",
  "America/Boa_Vista",
  "America/Bogota",
  "America/Boise",
  "America/Buenos_Aires",
  "America/Cambridge_Bay",
  "America/Campo_Grande",
  "America/Cancun",
  "America/Caracas",
  "America/Catamarca",
  "America/Cayenne",
  "America/Cayman",
  "America/Chicago",
  "America/Chihuahua",
  "America/Coral_Harbour",
  "America/Cordoba",
  "America/Costa_Rica",
  "America/Creston",
  "America/Cuiaba",
  "America/Curacao",
  "America/Danmarkshavn",
  "America/Dawson",
  "America/Dawson_Creek",
  "America/Denver",
  "America/Detroit",
  "America/Dominica",
  "America/Edmonton",
  "America/Eirunepe",
  "America/El_Salvador",
  "America/Ensenada",
  "America/Fort_Wayne",
  "America/Fortaleza",
  "America/Glace_Bay",
  "America/Godthab",
  "America/Goose_Bay",
  "America/Grand_Turk",
  "America/Grenada",
  "America/Guadeloupe",
  "America/Guatemala",
  "America/Guayaquil",
  "America/Guyana",
  "America/Halifax",
  "America/Havana",
  "America/Hermosillo",
  "America/Indiana/Indianapolis",
  "America/Indiana/Knox",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Tell_City",
  "America/Indiana/Vevay",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Indianapolis",
  "America/Inuvik",
  "America/Iqaluit",
  "America/Jamaica",
  "America/Jujuy",
  "America/Juneau",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Knox_IN",
  "America/Kralendijk",
  "America/La_Paz",
  "America/Lima",
  "America/Los_Angeles",
  "America/Louisville",
  "America/Lower_Princes",
  "America/Maceio",
  "America/Managua",
  "America/Manaus",
  "America/Marigot",
  "America/Martinique",
  "America/Matamoros",
  "America/Mazatlan",
  "America/Mendoza",
  "America/Menominee",
  "America/Merida",
  "America/Metlakatla",
  "America/Mexico_City",
  "America/Miquelon",
  "America/Moncton",
  "America/Monterrey",
  "America/Montevideo",
  "America/Montreal",
  "America/Montserrat",
  "America/Nassau",
  "America/New_York",
  "America/Nipigon",
  "America/Nome",
  "America/Noronha",
  "America/North_Dakota/Beulah",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/Ojinaga",
  "America/Panama",
  "America/Pangnirtung",
  "America/Paramaribo",
  "America/Phoenix",
  "America/Port-au-Prince",
  "America/Port_of_Spain",
  "America/Porto_Acre",
  "America/Porto_Velho",
  "America/Puerto_Rico",
  "America/Rainy_River",
  "America/Rankin_Inlet",
  "America/Recife",
  "America/Regina",
  "America/Resolute",
  "America/Rio_Branco",
  "America/Rosario",
  "America/Santa_Isabel",
  "America/Santarem",
  "America/Santiago",
  "America/Santo_Domingo",
  "America/Sao_Paulo",
  "America/Scoresbysund",
  "America/Shiprock",
  "America/Sitka",
  "America/St_Barthelemy",
  "America/St_Johns",
  "America/St_Kitts",
  "America/St_Lucia",
  "America/St_Thomas",
  "America/St_Vincent",
  "America/Swift_Current",
  "America/Tegucigalpa",
  "America/Thule",
  "America/Thunder_Bay",
  "America/Tijuana",
  "America/Toronto",
  "America/Tortola",
  "America/Vancouver",
  "America/Virgin",
  "America/Whitehorse",
  "America/Winnipeg",
  "America/Yakutat",
  "America/Yellowknife",
  "Africa/Abidjan",
  "Africa/Accra",
  "Africa/Addis_Ababa",
  "Africa/Algiers",
  "Africa/Asmara",
  "Africa/Asmera",
  "Africa/Bamako",
  "Africa/Bangui",
  "Africa/Banjul",
  "Africa/Bissau",
  "Africa/Blantyre",
  "Africa/Brazzaville",
  "Africa/Bujumbura",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Africa/Ceuta",
  "Africa/Conakry",
  "Africa/Dakar",
  "Africa/Dar_es_Salaam",
  "Africa/Djibouti",
  "Africa/Douala",
  "Africa/El_Aaiun",
  "Africa/Freetown",
  "Africa/Gaborone",
  "Africa/Harare",
  "Africa/Johannesburg",
  "Africa/Juba",
  "Africa/Kampala",
  "Africa/Khartoum",
  "Africa/Kigali",
  "Africa/Kinshasa",
  "Africa/Lagos",
  "Africa/Libreville",
  "Africa/Lome",
  "Africa/Luanda",
  "Africa/Lubumbashi",
  "Africa/Lusaka",
  "Africa/Malabo",
  "Africa/Maputo",
  "Africa/Maseru",
  "Africa/Mbabane",
  "Africa/Mogadishu",
  "Africa/Monrovia",
  "Africa/Nairobi",
  "Africa/Ndjamena",
  "Africa/Niamey",
  "Africa/Nouakchott",
  "Africa/Ouagadougou",
  "Africa/Porto-Novo",
  "Africa/Sao_Tome",
  "Africa/Timbuktu",
  "Africa/Tripoli",
  "Africa/Tunis",
  "Africa/Windhoek",
  "Antarctica/Casey",
  "Antarctica/Davis",
  "Antarctica/DumontDUrville",
  "Antarctica/Macquarie",
  "Antarctica/Mawson",
  "Antarctica/McMurdo",
  "Antarctica/Palmer",
  "Antarctica/Rothera",
  "Antarctica/South_Pole",
  "Antarctica/Syowa",
  "Antarctica/Troll",
  "Antarctica/Vostok",
  "Arctic/Longyearbyen",
  "Asia/Aden",
  "Asia/Almaty",
  "Asia/Amman",
  "Asia/Anadyr",
  "Asia/Aqtau",
  "Asia/Aqtobe",
  "Asia/Ashgabat",
  "Asia/Ashkhabad",
  "Asia/Baghdad",
  "Asia/Bahrain",
  "Asia/Baku",
  "Asia/Bangkok",
  "Asia/Beirut",
  "Asia/Bishkek",
  "Asia/Brunei",
  "Asia/Calcutta",
  "Asia/Chita",
  "Asia/Choibalsan",
  "Asia/Chongqing",
  "Asia/Chungking",
  "Asia/Colombo",
  "Asia/Dacca",
  "Asia/Damascus",
  "Asia/Dhaka",
  "Asia/Dili",
  "Asia/Dubai",
  "Asia/Dushanbe",
  "Asia/Gaza",
  "Asia/Harbin",
  "Asia/Hebron",
  "Asia/Ho_Chi_Minh",
  "Asia/Hong_Kong",
  "Asia/Hovd",
  "Asia/Irkutsk",
  "Asia/Istanbul",
  "Asia/Jakarta",
  "Asia/Jayapura",
  "Asia/Jerusalem",
  "Asia/Kabul",
  "Asia/Kamchatka",
  "Asia/Karachi",
  "Asia/Kashgar",
  "Asia/Kathmandu",
  "Asia/Katmandu",
  "Asia/Khandyga",
  "Asia/Kolkata",
  "Asia/Krasnoyarsk",
  "Asia/Kuala_Lumpur",
  "Asia/Kuching",
  "Asia/Kuwait",
  "Asia/Macao",
  "Asia/Macau",
  "Asia/Magadan",
  "Asia/Makassar",
  "Asia/Manila",
  "Asia/Muscat",
  "Asia/Nicosia",
  "Asia/Novokuznetsk",
  "Asia/Novosibirsk",
  "Asia/Omsk",
  "Asia/Oral",
  "Asia/Phnom_Penh",
  "Asia/Pontianak",
  "Asia/Pyongyang",
  "Asia/Qatar",
  "Asia/Qyzylorda",
  "Asia/Rangoon",
  "Asia/Riyadh",
  "Asia/Riyadh87",
  "Asia/Riyadh88",
  "Asia/Riyadh89",
  "Asia/Saigon",
  "Asia/Sakhalin",
  "Asia/Samarkand",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Srednekolymsk",
  "Asia/Taipei",
  "Asia/Tashkent",
  "Asia/Tbilisi",
  "Asia/Tehran",
  "Asia/Tel_Aviv",
  "Asia/Thimbu",
  "Asia/Thimphu",
  "Asia/Tokyo",
  "Asia/Ujung_Pandang",
  "Asia/Ulaanbaatar",
  "Asia/Ulan_Bator",
  "Asia/Urumqi",
  "Asia/Ust-Nera",
  "Asia/Vientiane",
  "Asia/Vladivostok",
  "Asia/Yakutsk",
  "Asia/Yekaterinburg",
  "Asia/Yerevan",
  "Atlantic/Azores",
  "Atlantic/Bermuda",
  "Atlantic/Canary",
  "Atlantic/Cape_Verde",
  "Atlantic/Faeroe",
  "Atlantic/Faroe",
  "Atlantic/Jan_Mayen",
  "Atlantic/Madeira",
  "Atlantic/Reykjavik",
  "Atlantic/South_Georgia",
  "Atlantic/St_Helena",
  "Atlantic/Stanley",
  "Australia/ACT",
  "Australia/Adelaide",
  "Australia/Brisbane",
  "Australia/Broken_Hill",
  "Australia/Canberra",
  "Australia/Currie",
  "Australia/Darwin",
  "Australia/Eucla",
  "Australia/Hobart",
  "Australia/LHI",
  "Australia/Lindeman",
  "Australia/Lord_Howe",
  "Australia/Melbourne",
  "Australia/NSW",
  "Australia/North",
  "Australia/Perth",
  "Australia/Queensland",
  "Australia/South",
  "Australia/Sydney",
  "Australia/Tasmania",
  "Australia/Victoria",
  "Australia/West",
  "Australia/Yancowinna",
  "BET",
  "BST",
  "Brazil/Acre",
  "Brazil/DeNoronha",
  "Brazil/East",
  "Brazil/West",
  "CAT",
  "CET",
  "CNT",
  "CST",
  "CST6CDT",
  "CTT",
  "Canada/Atlantic",
  "Canada/Central",
  "Canada/East-Saskatchewan",
  "Canada/Eastern",
  "Canada/Mountain",
  "Canada/Newfoundland",
  "Canada/Pacific",
  "Canada/Saskatchewan",
  "Canada/Yukon",
  "Chile/Continental",
  "Chile/EasterIsland",
  "Cuba",
  "EAT",
  "ECT",
  "EET",
  "EST",
  "EST5EDT",
  "Egypt",
  "Eire",
  "Etc/GMT",
  "Etc/GMT+0",
  "Etc/GMT+1",
  "Etc/GMT+10",
  "Etc/GMT+11",
  "Etc/GMT+12",
  "Etc/GMT+2",
  "Etc/GMT+3",
  "Etc/GMT+4",
  "Etc/GMT+5",
  "Etc/GMT+6",
  "Etc/GMT+7",
  "Etc/GMT+8",
  "Etc/GMT+9",
  "Etc/GMT-0",
  "Etc/GMT-1",
  "Etc/GMT-10",
  "Etc/GMT-11",
  "Etc/GMT-12",
  "Etc/GMT-13",
  "Etc/GMT-14",
  "Etc/GMT-2",
  "Etc/GMT-3",
  "Etc/GMT-4",
  "Etc/GMT-5",
  "Etc/GMT-6",
  "Etc/GMT-7",
  "Etc/GMT-8",
  "Etc/GMT-9",
  "Etc/GMT0",
  "Etc/Greenwich",
  "Etc/UCT",
  "Etc/UTC",
  "Etc/Universal",
  "Etc/Zulu",
  "Europe/Amsterdam",
  "Europe/Andorra",
  "Europe/Athens",
  "Europe/Belfast",
  "Europe/Belgrade",
  "Europe/Berlin",
  "Europe/Bratislava",
  "Europe/Brussels",
  "Europe/Bucharest",
  "Europe/Budapest",
  "Europe/Busingen",
  "Europe/Chisinau",
  "Europe/Copenhagen",
  "Europe/Dublin",
  "Europe/Gibraltar",
  "Europe/Guernsey",
  "Europe/Helsinki",
  "Europe/Isle_of_Man",
  "Europe/Istanbul",
  "Europe/Jersey",
  "Europe/Kaliningrad",
  "Europe/Kiev",
  "Europe/Lisbon",
  "Europe/Ljubljana",
  "Europe/London",
  "Europe/Luxembourg",
  "Europe/Madrid",
  "Europe/Malta",
  "Europe/Mariehamn",
  "Europe/Minsk",
  "Europe/Monaco",
  "Europe/Moscow",
  "Europe/Nicosia",
  "Europe/Oslo",
  "Europe/Paris",
  "Europe/Podgorica",
  "Europe/Prague",
  "Europe/Riga",
  "Europe/Rome",
  "Europe/Samara",
  "Europe/San_Marino",
  "Europe/Sarajevo",
  "Europe/Simferopol",
  "Europe/Skopje",
  "Europe/Sofia",
  "Europe/Stockholm",
  "Europe/Tallinn",
  "Europe/Tirane",
  "Europe/Tiraspol",
  "Europe/Uzhgorod",
  "Europe/Vaduz",
  "Europe/Vatican",
  "Europe/Vienna",
  "Europe/Vilnius",
  "Europe/Volgograd",
  "Europe/Warsaw",
  "Europe/Zagreb",
  "Europe/Zaporozhye",
  "Europe/Zurich",
  "GB",
  "GB-Eire",
  "GMT",
  "GMT0",
  "Greenwich",
  "HST",
  "Hongkong",
  "IET",
  "IST",
  "Iceland",
  "Indian/Antananarivo",
  "Indian/Chagos",
  "Indian/Christmas",
  "Indian/Cocos",
  "Indian/Comoro",
  "Indian/Kerguelen",
  "Indian/Mahe",
  "Indian/Maldives",
  "Indian/Mauritius",
  "Indian/Mayotte",
  "Indian/Reunion",
  "Iran",
  "Israel",
  "JST",
  "Jamaica",
  "Japan",
  "Kwajalein",
  "Libya",
  "MET",
  "MIT",
  "MST",
  "MST7MDT",
  "Mexico/BajaNorte",
  "Mexico/BajaSur",
  "Mexico/General",
  "Mideast/Riyadh87",
  "Mideast/Riyadh88",
  "Mideast/Riyadh89",
  "NET",
  "NST",
  "NZ",
  "NZ-CHAT",
  "Navajo",
  "PLT",
  "PNT",
  "PRC",
  "PRT",
  "PST",
  "PST8PDT",
  "Pacific/Apia",
  "Pacific/Auckland",
  "Pacific/Bougainville",
  "Pacific/Chatham",
  "Pacific/Chuuk",
  "Pacific/Easter",
  "Pacific/Efate",
  "Pacific/Enderbury",
  "Pacific/Fakaofo",
  "Pacific/Fiji",
  "Pacific/Funafuti",
  "Pacific/Galapagos",
  "Pacific/Gambier",
  "Pacific/Guadalcanal",
  "Pacific/Guam",
  "Pacific/Honolulu",
  "Pacific/Johnston",
  "Pacific/Kiritimati",
  "Pacific/Kosrae",
  "Pacific/Kwajalein",
  "Pacific/Majuro",
  "Pacific/Marquesas",
  "Pacific/Midway",
  "Pacific/Nauru",
  "Pacific/Niue",
  "Pacific/Norfolk",
  "Pacific/Noumea",
  "Pacific/Pago_Pago",
  "Pacific/Palau",
  "Pacific/Pitcairn",
  "Pacific/Pohnpei",
  "Pacific/Ponape",
  "Pacific/Port_Moresby",
  "Pacific/Rarotonga",
  "Pacific/Saipan",
  "Pacific/Samoa",
  "Pacific/Tahiti",
  "Pacific/Tarawa",
  "Pacific/Tongatapu",
  "Pacific/Truk",
  "Pacific/Wake",
  "Pacific/Wallis",
  "Pacific/Yap",
  "Poland",
  "Portugal",
  "ROK",
  "SST",
  "Singapore",
  "SystemV/AST4",
  "SystemV/AST4ADT",
  "SystemV/CST6",
  "SystemV/CST6CDT",
  "SystemV/EST5",
  "SystemV/EST5EDT",
  "SystemV/HST10",
  "SystemV/MST7",
  "SystemV/MST7MDT",
  "SystemV/PST8",
  "SystemV/PST8PDT",
  "SystemV/YST9",
  "SystemV/YST9YDT",
  "Turkey",
  "UCT",
  "US/Alaska",
  "US/Aleutian",
  "US/Arizona",
  "US/Central",
  "US/East-Indiana",
  "US/Eastern",
  "US/Hawaii",
  "US/Indiana-Starke",
  "US/Michigan",
  "US/Mountain",
  "US/Pacific",
  "US/Pacific-New",
  "US/Samoa",
  "UTC",
  "Universal",
  "VST",
  "W-SU",
  "WET",
  "Zulu"];


}
