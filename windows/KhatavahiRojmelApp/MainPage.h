#pragma once
#include "MainPage.g.h"
#include <winrt/Microsoft.ReactNative.h>

namespace winrt::KhatavahiRojmelApp::implementation
{
    struct MainPage : MainPageT<MainPage>
    {
        MainPage();
    };
}

namespace winrt::KhatavahiRojmelApp::factory_implementation
{
    struct MainPage : MainPageT<MainPage, implementation::MainPage>
    {
    };
}

