/*
 * @name		p3-styleguide
 * @version		v0.3.0
 * @date		2014-03-27
 * @copyright	Copyright (C) 2013, Greenpeace International
 * @source		https://github.com/greenpeace/p3_styleguide*/
/* @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later */
!function(a,b){"use strict";var c={live:{parameters:{action:685},actions:{base:"https://secured.greenpeace.org/international/en/api/v2/pledges/",signerCheck:"https://secured.greenpeace.org/international/en/api/v2/pledges/signercheck/",validation:"json/rules_ocean_en.json"}}};a.ajaxSetup({cache:!1}),a(b.document).ready(function(){a.p3.form_tracking(".js-track-abandonment"),a("input[name=email]").focus(),a.p3.autofill("#action-form"),a.p3.validation("#action-form",{jsonURL:c.live.actions.validation,params:c.live.parameters})})}(jQuery,this);
/* @license-end */