﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Models
{
    public interface IResponse
    {
        string Message { get; set; } 

        bool DidError { get; set; } 

        string ErrorMessage { get; set; }

        int Status { get; set; }
    }

    public interface ISingleResponse<TModel> : IResponse
    {
        TModel Model { get; set; }
    }

    public interface IListResponse<TModel> : IResponse
    {
        IEnumerable<TModel> Model { get; set; }
    }

    

    public class Response : IResponse
    {
        public string Message { get; set; }

        public bool DidError { get; set; }

        public string ErrorMessage { get; set; }

        public string Token { get; set; }

        public bool IsAuthenticated { get; set; }

        public int Status { get; set; }
    }

    public class SingleResponse<TModel> : ISingleResponse<TModel>
    {
        public string Message { get; set; }

        public bool DidError { get; set; }

        public string ErrorMessage { get; set; }

        public TModel Model { get; set; }

        public string Token { get; set; }

        public bool IsAuthenticated { get; set; }

        public int Status { get; set; }
    }

    public class ListResponse<TModel> : IListResponse<TModel>
    {
        public string Message { get; set; }

        public bool DidError { get; set; }

        public string ErrorMessage { get; set; }

        public IEnumerable<TModel> Model { get; set; }

        public string Token { get; set; }

        public bool IsAuthenticated { get; set; }

        public int Status { get; set; }
    }

    

    public static class ResponseExtensions
    {
        public static IActionResult ToHttpResponse(this IResponse response)
        {
            //var status = response.DidError ? HttpStatusCode.InternalServerError : HttpStatusCode.OK;

            return new ObjectResult(response)
            {
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        public static IActionResult ToHttpResponse<TModel>(this ISingleResponse<TModel> response)
        {
            var status = HttpStatusCode.OK;

            //if (response.DidError)
            //    status = HttpStatusCode.InternalServerError;
            //else if (response.Model == null)
            //    status = HttpStatusCode.NotFound;

            return new ObjectResult(response)
            {
                StatusCode = (int)status
            };
        }

        public static IActionResult ToHttpResponse<TModel>(this IListResponse<TModel> response)
        {
            var status = HttpStatusCode.OK;

            //if (response.DidError)
            //    status = HttpStatusCode.InternalServerError;
            //else if (response.Model == null)
            //    status = HttpStatusCode.NoContent;

            return new ObjectResult(response)
            {
                StatusCode = (int)status
            };
        }


    }
}
