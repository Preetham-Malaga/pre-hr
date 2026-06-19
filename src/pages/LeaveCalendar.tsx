import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useLeaveCalendar } from "../hooks/useLeaveCalendar";

export default function LeaveCalendar() {
  const { data, isLoading } =
    useLeaveCalendar();

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  if (isLoading) {
    return (
      <div className="p-6">
        Loading Calendar...
      </div>
    );
  }

  const leaves =
    data?.leaves || [];

  const holidays =
    data?.holidays || [];

  const selectedDateStr =
    selectedDate
      .toISOString()
      .split("T")[0];

  const todayLeaves =
    leaves.filter(
      (leave: any) =>
        leave.from_date <=
          selectedDateStr &&
        leave.to_date >=
          selectedDateStr
    );

  const todayHolidays =
    holidays.filter(
      (holiday: any) =>
        holiday.holiday_date ===
        selectedDateStr
    );

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Leave Calendar
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Calendar */}

        <div className="lg:col-span-3 bg-white rounded-xl shadow p-4">

          <Calendar
            onChange={(value) =>
              setSelectedDate(
                value as Date
              )
            }
            value={selectedDate}
            className="w-full border-0"
            tileContent={({
              date,
            }) => {
              const currentDate =
                date
                  .toISOString()
                  .split("T")[0];

              const leave =
                leaves.find(
                  (
                    item: any
                  ) =>
                    item.from_date <=
                      currentDate &&
                    item.to_date >=
                      currentDate
                );

              const holiday =
                holidays.find(
                  (
                    item: any
                  ) =>
                    item.holiday_date ===
                    currentDate
                );

              return (
                <div className="mt-1 flex flex-col gap-1">

                  {holiday && (
                    <div className="bg-blue-500 text-white text-[10px] rounded px-1 text-center">
                      🎉
                    </div>
                  )}

                  {leave && (
                    <div className="bg-red-500 text-white text-[10px] rounded px-1 text-center">
                      🏖
                    </div>
                  )}

                </div>
              );
            }}
          />

        </div>

        {/* Right Panel */}

        <div className="bg-white rounded-xl shadow p-4">

          <h2 className="text-lg font-bold mb-4">
            {selectedDate.toLocaleDateString()}
          </h2>

          {/* Holidays */}

          <div className="mb-6">

            <h3 className="font-semibold text-blue-600 mb-2">
              Holidays
            </h3>

            {todayHolidays.length >
            0 ? (
              todayHolidays.map(
                (
                  holiday: any
                ) => (
                  <div
                    key={
                      holiday.id
                    }
                    className="border rounded-lg p-3 mb-2 bg-blue-50"
                  >
                    <div className="font-medium">
                      {
                        holiday.holiday_name
                      }
                    </div>

                    <div className="text-sm text-gray-500">
                      {
                        holiday.holiday_type
                      }
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-sm text-gray-500">
                No Holidays
              </p>
            )}

          </div>

          {/* Employees On Leave */}

          <div>

            <h3 className="font-semibold text-red-600 mb-2">
              Employees On Leave
            </h3>

            {todayLeaves.length >
            0 ? (
              todayLeaves.map(
                (
                  leave: any
                ) => (
                  <div
                    key={
                      leave.id
                    }
                    className="border rounded-lg p-3 mb-2 bg-red-50"
                  >
                    <div className="font-medium">
                      {
                        leave.employee_name
                      }
                    </div>

                    <div className="text-sm text-gray-500">
                      {
                        leave.leave_type
                      }
                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {
                        leave.from_date
                      }{" "}
                      -{" "}
                      {
                        leave.to_date
                      }
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-sm text-gray-500">
                No Employees On Leave
              </p>
            )}

          </div>

        </div>

      </div>

      {/* Legend */}

      <div className="mt-6 bg-white rounded-xl shadow p-4">

        <h2 className="font-semibold mb-3">
          Legend
        </h2>

        <div className="flex gap-6">

          <div>
            🎉 Holiday
          </div>

          <div>
            🏖 Approved Leave
          </div>

        </div>

      </div>

    </div>
  );
}